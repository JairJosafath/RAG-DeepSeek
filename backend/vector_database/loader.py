import os
from werkzeug.datastructures import FileStorage
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader

from vector_database.store import get_or_create_vector_store


def embed_file(title, file: FileStorage):
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

    chunks = []
    for chunk in loader.lazy_load():
        chunks.append(chunk)

    store = get_or_create_vector_store()
    store.add_documents([chunk for chunk in chunks])
    return file_path
