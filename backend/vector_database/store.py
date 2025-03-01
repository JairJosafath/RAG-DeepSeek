import chromadb
from langchain_ollama import embeddings
from langchain_chroma import Chroma
from typing import List, Dict
from itertools import groupby
from operator import itemgetter

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

def list_documents(collection_name: str = "default") -> List[Dict]:
    """
    List all documents in the collection, grouped by document_id
    """
    client, _ = setup_chroma()
    collection = client.get_collection(collection_name)
    result = collection.get()
    
    # Group chunks by document_id
    grouped_docs = {}
    for i, metadata in enumerate(result['metadatas']):
        doc_id = metadata.get('document_id')
        if doc_id:
            if doc_id not in grouped_docs:
                grouped_docs[doc_id] = {
                    'document_id': doc_id,
                    'title': metadata.get('title', 'Untitled'),
                    'chunk_ids': [],
                    'total_chunks': 0
                }
            grouped_docs[doc_id]['chunk_ids'].append(result['ids'][i])
            grouped_docs[doc_id]['total_chunks'] += 1
    
    return list(grouped_docs.values())

def delete_document(document_id: str, collection_name: str = "default") -> bool:
    """
    Delete all chunks belonging to a document from the collection
    """
    try:
        client, _ = setup_chroma()
        collection = client.get_collection(collection_name)
        
        # Get all chunks for this document
        result = collection.get(
            where={"document_id": document_id}
        )
        
        if result['ids']:
            # Delete all chunks at once
            collection.delete(ids=result['ids'])
            return True
        return False
    except Exception as e:
        print(f"Error deleting document: {e}")
        return False
