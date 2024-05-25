from langchain_core.pydantic_v1 import BaseModel
from langchain_core.runnables import RunnableLambda
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from ..settings import settings  # Import the settings

class TitleInput(BaseModel):
    message: str

TITLE_PROMPT = ChatPromptTemplate.from_template("Generate a short and catchy title for the following message: {message}")

title_chain = (
    TITLE_PROMPT
    | ChatOpenAI(temperature=0, openai_api_key=settings.openai_api_key, model=settings.openai_model)
    | StrOutputParser()
)

def generate_title(input_message: str) -> str:
    response = title_chain.invoke({"message": input_message})
    return response.strip().strip('"')  # Clean up the response if necessary
