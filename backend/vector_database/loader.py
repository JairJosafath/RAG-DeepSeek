import os
from werkzeug.datastructures import FileStorage


def embed_file(title, file: FileStorage, size, type):
    # Store file locally
    os.makedirs("tmp", exist_ok=True)
    file_path = os.path.join("tmp", title)
    file.save(file_path)

    

    return file_path
