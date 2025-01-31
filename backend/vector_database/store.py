import chromadb
from langchain_ollama import embeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv
import os


def setup_chroma():

    load_dotenv()

    OLLAMA_BASE_URL = os.getenv(
        "OLLAMA_BASE_URL",
        "http://ollama:11434")

    OLLAMA_EMBEDDING_MODEL = os.getenv(
        "OLLAMA_EMBEDDING_MODEL",
        "nomic-embed-text")

    CHROMA_HOST = os.getenv("CHROMA_HOST", "chromadb")

    client = chromadb.HttpClient(
        host=CHROMA_HOST,
        port=8000
    )

    embedding = embeddings.OllamaEmbeddings(
        model=OLLAMA_EMBEDDING_MODEL,
        base_url=OLLAMA_BASE_URL,
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
        # persist_directory=CHROMA_PERSISTENT_DIRECTORY
    )

    return vector_store


def heartbeat():
    client, _ = setup_chroma()
    return client.heartbeat()
