import json
from typing import Any

import requests
from bs4 import BeautifulSoup
from langchain_community.retrievers import TavilySearchAPIRetriever
from langchain_openai import ChatOpenAI
from langchain_community.utilities import DuckDuckGoSearchAPIWrapper
from langchain_core.messages import SystemMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import (
    ConfigurableField,
    Runnable,
    RunnableLambda,
    RunnableParallel,
    RunnablePassthrough,
)
from ..settings import settings  # Import the settings

RESULTS_PER_QUESTION = 3

ddg_search = DuckDuckGoSearchAPIWrapper()

def scrape_text(url: str):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            page_text = soup.get_text(separator=" ", strip=True)
            return page_text
        else:
            return f"Failed to retrieve the webpage: Status code {response.status_code}"
    except Exception as e:
        return f"Failed to retrieve the webpage: {e}"

def web_search(query: str, num_results: int):
    results = ddg_search.results(query, num_results)
    return [r["link"] for r in results]

get_links: Runnable[Any, Any] = (
    RunnablePassthrough()
    | RunnableLambda(
        lambda x: [
            {"url": url, "question": x["question"]}
            for url in web_search(query=x["question"], num_results=RESULTS_PER_QUESTION)
        ]
    )
).configurable_alternatives(
    ConfigurableField("search_engine"),
    default_key="duckduckgo",
    tavily=RunnableLambda(lambda x: x["question"])
    | RunnableParallel(
        {
            "question": RunnablePassthrough(),
            "results": TavilySearchAPIRetriever(k=RESULTS_PER_QUESTION),
        }
    )
    | RunnableLambda(
        lambda x: [
            {"url": result.metadata["source"], "question": x["question"]}
            for result in x["results"]
        ]
    ),
)

SEARCH_PROMPT = ChatPromptTemplate.from_messages(
    [
        ("system", "{agent_prompt}"),
        (
            "user",
            "Write 3 google search queries to search online for graduate programs in the following field: {question}\n"
            "You must respond with a list of strings in the following format: "
            '["query 1", "query 2", "query 3"].',
        ),
    ]
)

AUTO_AGENT_INSTRUCTIONS = """
This task involves researching graduate programs, regardless of their complexity or the availability of definitive information. The research is conducted by a specific agent, defined by its type and role, with each agent requiring distinct instructions.
Agent
The agent is determined by the field of the topic and the specific name of the agent that could be utilized to research the topic provided. Agents are categorized by their area of expertise, and each agent type is associated with a corresponding emoji.

examples:
task: "Find the best graduate programs in computer science."
response: 
{
    "agent": "🎓 Education Agent",
    "agent_role_prompt": "You are a knowledgeable education advisor AI assistant. Your primary goal is to provide comprehensive, detailed, impartial, and well-organized reports on available graduate programs based on the provided data and trends."
}
task: "What are the top MBA programs?"
response: 
{ 
    "agent":  "📊 Business Education Agent",
    "agent_role_prompt": "You are an experienced business education advisor AI assistant. Your main objective is to produce comprehensive, insightful, impartial, and systematically structured reports on top MBA programs based on provided data, market trends, and educational analysis."
}
"""
CHOOSE_AGENT_PROMPT = ChatPromptTemplate.from_messages(
    [SystemMessage(content=AUTO_AGENT_INSTRUCTIONS), ("user", "task: {task}")]
)

SUMMARY_TEMPLATE = """{text} 

-----------

Using the above text, answer in short the following question: 

> {question}
 
-----------
If the question cannot be answered using the text, simply summarize the text. Include all factual information, numbers, stats, etc. if available."""
SUMMARY_PROMPT = ChatPromptTemplate.from_template(SUMMARY_TEMPLATE)

scrape_and_summarize: Runnable[Any, Any] = (
    RunnableParallel(
        {
            "question": lambda x: x["question"],
            "text": lambda x: scrape_text(x["url"])[:10000],
            "url": lambda x: x["url"],
        }
    )
    | RunnableParallel(
        {
            "summary": SUMMARY_PROMPT | ChatOpenAI(temperature=0, openai_api_key=settings.openai_api_key, model=settings.openai_model) | StrOutputParser(),
            "url": lambda x: x["url"],
        }
    )
    | RunnableLambda(lambda x: f"Source Url: {x['url']}\nSummary: {x['summary']}")
)

multi_search = get_links | scrape_and_summarize.map() | (lambda x: "\n".join(x))

def load_json(s):
    try:
        return json.loads(s)
    except Exception:
        return {}

search_query = SEARCH_PROMPT | ChatOpenAI(temperature=0, openai_api_key=settings.openai_api_key, model=settings.openai_model) | StrOutputParser() | load_json
choose_agent = (
    CHOOSE_AGENT_PROMPT | ChatOpenAI(temperature=0, openai_api_key=settings.openai_api_key, model=settings.openai_model) | StrOutputParser() | load_json
)

get_search_queries = (
    RunnablePassthrough().assign(
        agent_prompt=RunnableParallel({"task": lambda x: x})
        | choose_agent
        | (lambda x: x.get("agent_role_prompt"))
    )
    | search_query
)

chain = (
    get_search_queries
    | (lambda x: [{"question": q} for q in x])
    | multi_search.map()
    | (lambda x: "\n\n".join(x))
)

# Function to perform the task of searching for graduate programs
def search_graduate_programs(task: str):
    response = chain.invoke({"task": task})  # Use invoke instead of run
    return response
