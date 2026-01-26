from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.config import settings


def generate_summary(title: str, content: str) -> str:
    """
    Generate a summary for a given post using Google Generative AI.
    """
    # Prompt template for summarization
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "You are a helpful assistant that summarizes blog posts."),
            (
                "user",
                "Summarize the following blog post:\n\nTitle: {title}\n\nContent: {content}",
            ),
        ]
    )

    # Initialize the Google Generative AI model
    model = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash", 
        api_key=settings.google_api_key, 
        temperature=0
    )

    # Chain the prompt with the model
    chain = prompt | model | StrOutputParser()

    # Execute the chain with provided title and content
    try:
        return chain.invoke({"title": title, "content": content})
    except Exception as e:
        raise ValueError(f"Error generating summary: {str(e)}")