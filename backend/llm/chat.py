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
    # COLLECTION_NAME = load_env()
    llm: ChatOllama = create_chatbot(
        model=model,
        num_predict=num_predict,
        disable_streaming=disable_streaming,
        top_p=top_p,
        top_k=top_k,
        temperature=temperature
    )

    # vector_store = get_or_create_vector_store(COLLECTION_NAME)

    # results = vector_store.similarity_search(
    #     query=user_input,
    # )

    # prompt_with_context = build_prompt_with_context(results)
    # prompt = use_prompt_template(user_input, prompt_with_context)

    # print(f"""
    # full prompt body
    #       {prompt}
    #       """, flush=True)

    # message = Message(content=user_input, sender="user", timestamp=time.asctime(), settings=json.dumps({
    #     "model": model,
    #     "num_predict": num_predict,
    #     "disable_streaming": disable_streaming,
    #     "top_p": top_p,
    #     "top_k": top_k,
    #     "temperature": temperature
    # }), prompt_context=prompt.model_dump_json())

    # write_to_db(message.create_insert_query())

    chain = llm

    return chain.stream(user_input)
