import fitz
import logging
from llama_index.core import Document
from app.dependencies import get_embedding_model, get_postgres_store
from llama_index.core.node_parser import SimpleNodeParser

logger = logging.getLogger(__name__)


class EmbedChunks:
    def __init__(self, model_name):
        self.embedding_model = get_embedding_model(model_name)
        print("embedding_model:", self.embedding_model)

    def __call__(self, node_batch):
        nodes = node_batch["node"]
        text = [node.text for node in nodes]
        embeddings = self.embedding_model.get_text_embedding_batch(text)
        assert len(nodes) == len(embeddings)

        for node, embedding in zip(nodes, embeddings):
            node.embedding = embedding

        return {"embedded_nodes": nodes}


class StoreResults:
    def __init__(self):
        self.vector_store = get_postgres_store()
        print(f"StoreResults: vector_store:", self.vector_store)

    def __call__(self, batch):
        try:
            embedded_nodes = batch["embedded_nodes"]

            self.vector_store.add(list(embedded_nodes))
            print(f"Stored {len(embedded_nodes)} embedded nodes")
        except Exception as e:
            logger.error(f"Error storing results: {e}")
            raise
        return {}


def process_pdf(file_path, document_id):
    try:
        print(f"Processing PDF: {file_path}")
        document = fitz.open(file_path)
        text = ""
        for page in document:
            text += page.get_text()

        print("Splitting text into smaller chunks")
        # Split the text into smaller chunks
        node_parser = SimpleNodeParser.from_defaults(chunk_size=100, chunk_overlap=25)
        if not node_parser:
            raise ValueError("node_parser should not be None")
        documents = node_parser.get_nodes_from_documents(
            [
                Document(
                    text=text,
                    metadata={"document_id": document_id, "source": file_path},
                )
            ]
        )
        if not documents:
            raise ValueError("documents should not be None")

        print("Embedding chunks")
        embedding_model_name = "text-embedding-ada-002"
        embedder = EmbedChunks(model_name=embedding_model_name)
        if not embedder:
            raise ValueError("embedder should not be None")
        embedded_nodes = embedder({"node": documents})
        if not embedded_nodes:
            raise ValueError("embedded_nodes should not be None")

        print("Storing results")
        store_results = StoreResults()
        if not store_results:
            raise ValueError("store_results should not be None")
        store_results(embedded_nodes)
    except Exception as e:
        logger.error(f"Error processing PDF {file_path}: {e}")
        raise
