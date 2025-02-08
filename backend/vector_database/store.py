import chromadb
from langchain_ollama import embeddings
from langchain_chroma import Chroma

def setup_chroma():

    client = chromadb.HttpClient(
        host="chromadb",
        port=8000
    )

    embedding = embeddings.OllamaEmbeddings(
        model="nomic-embed-text",
        base_url="http://ollama:11434",
    )

    return client, embedding


def get_or_create_vector_store(collection_name: str = "default") -> Chroma:
    """
    Get or create a collection with the given name
    """
    client, embedding = setup_chroma()

    vector_store = Chroma(
        client=client,
        collection_name=collection_name,
        embedding_function=embedding,
    )

    return vector_store
