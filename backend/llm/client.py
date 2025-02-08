from langchain_ollama.chat_models import ChatOllama
from dotenv import load_dotenv
import os


def load_env():
    load_dotenv()

    LLAMA_HOST = os.getenv(
        "OLLAMA_BASE_URL"
    )
    return LLAMA_HOST


def create_chatbot(
    model,
        num_predict,
        disable_streaming,
        top_p,
        top_k,
        temperature,
):
    LLAMA_HOST = load_env()

    try:
        llm = ChatOllama(
            model=model,
            base_url=LLAMA_HOST,
            temperature=temperature,
            num_predict=num_predict,
            disable_streaming=disable_streaming,
            top_k=top_k,
            top_p=top_p
        )
        return llm
    except Exception as e:
        print(f"""
        error: {e}
        """, flush=True)

    return None
