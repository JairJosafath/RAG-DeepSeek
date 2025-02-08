from langchain_ollama.chat_models import ChatOllama
from vector_database.store import get_or_create_vector_store
from llm.client import create_chatbot
from collections.abc import Sequence
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.documents import Document

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

    vector_store = get_or_create_vector_store()

    results = vector_store.similarity_search(
        query=user_input,
    )

    prompt_with_context = build_prompt_with_context(results)
    prompt = use_prompt_template(user_input, prompt_with_context)

    return llm.stream(prompt)



def build_prompt_with_context(result: Sequence[Document]):
    context = """

    ###########
    context:

    """
    for doc in result:
        metadata = ""
        for key, value in doc.metadata.items():
            metadata += f"{key}: {value}\n"
        context += f"""
        <doc>
        <text>
        {doc.page_content}
        </text>
        <metadata>
        {metadata}
        </metadata>
        </doc>
        """

    context += """
    ###########

    """
    return context

def use_prompt_template(input: str, context: str, ):
    tmpl = ChatPromptTemplate([
        ("system", """
    You are a helpful AI assistant. You are helping a user with a question. 
         The user has provided a question and a context. 
         You should provide a helpful response to the user's question based on the context provided. 
         The user should be provided with the sources so they can verify the information.
         Do not tell the user about the context structure, since that is
         irrelevant to the user's question. the structure is only meant to help you generate a response.
         You only use the context to generate the response.
        """),

        ("system",
            """
      this is an example of a document in the context:
    <doc>
    <text>
    this is example text
    </text>
    <metadata>
    title: example_title
    year: 2022
    </metadata>
    </doc>
    """
         ),
        ("user", """
     {context}

     {question}

     """)
    ])

    return tmpl.invoke({"question": input, "context": context})
