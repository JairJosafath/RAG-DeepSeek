from langchain_ollama.chat_models import ChatOllama
from dotenv import load_dotenv
import os


def load_env():
    load_dotenv()

    LLAMA_HOST = os.getenv(
        "OLLAMA_BASE_URL"
    )

    LLAMA_MODEL = os.getenv(
        "LLAMA_MODEL",
        "llama3.2:1b"
    )

    return LLAMA_MODEL, LLAMA_HOST


def create_chatbot(
    model,
        num_predict,
        disable_streaming,
        top_p,
        top_k,
        temperature,
):
    LLAMA_MODEL, LLAMA_HOST = load_env()

    if model is None or model == "":
        model = LLAMA_MODEL

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


def hello_llama():
    llm = create_chatbot(num_predict=24, top_p=0.1, top_k=1, temperature=0.1)
    return llm.invoke([
        ("system", "You only need to say hello from llama."),
        ("human", "hello!"),
    ])
