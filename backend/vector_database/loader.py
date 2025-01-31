import os
from werkzeug.datastructures import FileStorage
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader

from vector_database.store import get_or_create_vector_store


def embed_file(title, file: FileStorage, size, type):
    # Store file locally
    os.makedirs("tmp", exist_ok=True)
    file_path = os.path.join("tmp", title)
    file.save(file_path)

    # chunk the file
    if type == "application/pdf":
        loader = PyPDFLoader(file_path)
    elif type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        loader = Docx2txtLoader(file_path)
    else:
        raise ValueError(f"Unsupported file type: {type}")

    chunks = []
    for chunk in loader.lazy_load():
        chunks.append(chunk)

    print(f"""
        File chunked
        Title: {title}
        Size: {size}
        Type: {type}
        Chunks: {len(chunks)}
            """,
          flush=True)

    store = get_or_create_vector_store()
    store.add_documents([chunk for chunk in chunks],
                        )
    return file_path
