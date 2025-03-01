import os
import uuid
from werkzeug.datastructures import FileStorage
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader
from langchain.docstore.document import Document

from vector_database.store import get_or_create_vector_store


def embed_file(title: str, file: FileStorage) -> str:
    # Generate a unique document ID
    document_id = str(uuid.uuid4())
    
    # Store file locally
    os.makedirs("tmp", exist_ok=True)
    file_path = os.path.join("tmp", title)
    file.save(file_path)

    type = file_path.split(".")[-1]

    # chunk the file
    if type == "pdf":
        loader = PyPDFLoader(file_path)
    else:
        raise ValueError(f"Unsupported file type: {type}")

    # Load and process chunks
    chunks = []
    for chunk in loader.lazy_load():
        # Add document metadata to each chunk
        chunk.metadata.update({
            "document_id": document_id,
            "title": title
        })
        chunks.append(chunk)

    # Add chunks to vector store
    store = get_or_create_vector_store()
    store.add_documents(chunks)

    # Clean up temporary file
    os.remove(file_path)
    
    return document_id
