from typing import Generator
from google import genai
from app.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)
model_name = "gemini-2.5-flash"

def chat(messages: list[dict]) -> str:
    response = client.models.generate_content(
        model=model_name,
        contents=messages
    )
    return response.text

def chat_stream(messages: list[dict]) -> Generator[str, None, None]:
    response = client.models.generate_content_stream(
        model=model_name,
        contents=messages
    )
    for chunk in response:
        if chunk.text:
            yield chunk.text
