import os

project_dir = "C:/Users/vster/Documents/rag-app/backend"


def convert_to_utf8(file_path):
    with open(file_path, "rb") as source_file:
        contents = source_file.read()
    with open(file_path, "w", encoding="utf-8") as target_file:
        target_file.write(contents.decode("latin1"))  # or the appropriate encoding


for root, dirs, files in os.walk(project_dir):
    for file in files:
        if file.endswith(".py"):
            file_path = os.path.join(root, file)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    f.read()
            except UnicodeDecodeError:
                print(f"Converting {file_path} to UTF-8")
                convert_to_utf8(file_path)
