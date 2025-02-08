from langchain_ollama.chat_models import ChatOllama
from llm.client import create_chatbot


def generate_response(
        user_input: str,
        model: str,
        num_predict: int = 128,
        disable_streaming: bool = True,
        top_p: float = .9,
        top_k: int = 40,
        temperature: float = 0.8
):
    llm: ChatOllama = create_chatbot(
        model=model,
        num_predict=num_predict,
        disable_streaming=disable_streaming,
        top_p=top_p,
        top_k=top_k,
        temperature=temperature
    )

    return llm.stream(user_input)
