import os
import logging
from fastapi import HTTPException, UploadFile, File
from pydantic import UUID4
from tenacity import (
    retry,
    wait_exponential,
    stop_after_attempt,
    retry_if_exception_type,
)
from llama_index.core import ServiceContext, VectorStoreIndex, Document
from llama_index.core.vector_stores.types import (
    MetadataFilters,
    ExactMatchFilter,
)
from llama_index.core.node_parser import SimpleNodeParser
from llama_index.llms.openai import OpenAI
from openai import APIConnectionError, RateLimitError
from app.dependencies import get_embedding_model, get_postgres_store, OPENAI_API_KEY
from app.schemas import QueryRag, QueryResponse

logger = logging.getLogger(__name__)

# Initialize the embedding model and vector store
embedding_model_name = "text-embedding-ada-002"
embedding_model = get_embedding_model(embedding_model_name)
vector_store = get_postgres_store()

# Use OpenAI as the LLM to LlamaIndex
print(f"OpenAI API key:", OPENAI_API_KEY)
llm = OpenAI(model="gpt-4o", temperature=0.5, api_key=OPENAI_API_KEY)
service_context = ServiceContext.from_defaults(embed_model=embedding_model, llm=llm)
index = VectorStoreIndex.from_vector_store(
    vector_store, service_context=service_context
)


@retry(
    wait=wait_exponential(multiplier=1, min=4, max=10),
    stop=stop_after_attempt(3),
    retry=retry_if_exception_type((APIConnectionError, RateLimitError)),
)
def generate_response(query, filters):
    try:
        query_engine = index.as_query_engine(
            llm=llm, similarity_top_k=5, filters=filters
        )
        response = query_engine.query(query)
        return response
    except APIConnectionError as e:
        logger.error(f"API connection error: {e}")
        raise
    except RateLimitError as e:
        logger.error(f"Rate limit error: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise


async def query_rag_system(request_query: QueryRag):
    try:

        query = request_query.query
        if not query:
            raise ValueError("Query should not be None")

        filters = MetadataFilters(filters=[])

        if request_query.filename:
            filters.filters.append(
                ExactMatchFilter(
                    key="source", value=f"./uploads/{request_query.filename}"
                )
            )

        retriever = index.as_retriever(similarity_top_k=5, filters=filters)
        if not retriever:
            raise ValueError("retriever should not be None")

        # Retrieve the relevant documents
        retrieved_nodes = retriever.retrieve(query)

        # Generate response using the LLM
        response = generate_response(query=query, filters=filters)
        response_text = response.response
        sources = [node.text for node in response.source_nodes]

        return QueryResponse(response=response_text, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
