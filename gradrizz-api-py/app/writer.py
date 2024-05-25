from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import ConfigurableField
from .settings import settings  # Import the settings

WRITER_SYSTEM_PROMPT = "You are an AI education advisor assistant. Your sole purpose is to write well-structured, informative, and detailed reports on graduate programs based on given text."

GRADUATE_PROGRAM_REPORT_TEMPLATE = """Information: 
--------
{research_summary}
--------

Based on the above information, generate a detailed report on the best graduate programs available for the following field or topic: "{question}". \
The report should be well-structured, informative, in-depth, and should include facts, figures, and numbers whenever available. \
You must write the report with markdown syntax. \
Include concrete and valid opinions based on the given information. Avoid general and meaningless conclusions. \
Write all used source URLs at the end of the report, and ensure there are no duplicated sources. \
The report should follow APA format. Please do your best, this is very important to my career."""

COMPARISON_REPORT_TEMPLATE = """Information: 
--------
{research_summary}
--------

Using the above information, generate a comparative analysis of the top graduate programs for the following field or topic: "{question}". \
The report should compare the programs based on key criteria such as curriculum, faculty, research opportunities, and career prospects. \
Ensure that the report is well-structured, informative, in-depth, and follows Markdown syntax. \
Include relevant facts, figures, and numbers whenever available. \
The report should be a minimum of 1,200 words.

Please do your best, this is very important to my career."""

OVERVIEW_REPORT_TEMPLATE = """Information: 
--------
{research_summary}
--------

Based on the above information, generate an overview of the graduate programs available for the following field or topic: "{question}". \
The overview should include the main sections, key points, and essential information about each program. \
The report should be detailed, informative, in-depth, and follow Markdown syntax. \
Use appropriate Markdown syntax to format the overview and ensure readability.

Please do your best, this is very important to my career."""

# Initialize ChatOpenAI with the API key and model from settings
model = ChatOpenAI(temperature=0, openai_api_key=settings.openai_api_key, model=settings.openai_model)
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", WRITER_SYSTEM_PROMPT),
        ("user", GRADUATE_PROGRAM_REPORT_TEMPLATE),
    ]
).configurable_alternatives(
    ConfigurableField("report_type"),
    default_key="graduate_program_report",
    comparison_report=ChatPromptTemplate.from_messages(
        [
            ("system", WRITER_SYSTEM_PROMPT),
            ("user", COMPARISON_REPORT_TEMPLATE),
        ]
    ),
    overview_report=ChatPromptTemplate.from_messages(
        [
            ("system", WRITER_SYSTEM_PROMPT),
            ("user", OVERVIEW_REPORT_TEMPLATE),
        ]
    ),
)
chain = prompt | model | StrOutputParser()
