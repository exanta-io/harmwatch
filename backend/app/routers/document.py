import os
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.responses import FileResponse

from app.services.pdf_processing import process_pdf
from app.dependencies import get_db
from app import crud
from app import schemas
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        # Ensure the uploads directory exists

        shared_data_path = "./uploads/"
        os.makedirs(shared_data_path, exist_ok=True)

        file_path = os.path.join(shared_data_path, file.filename)
        with open(file_path, "wb") as f:
            f.write(file.file.read())

        document_id = file.filename  # Use the filename as the document_id

        if not document_id:
            raise ValueError("Document ID should not be None")

        process_pdf(file_path, document_id)
        return {"message": "File uploaded successfully", "filename": file.filename}
    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/documents", response_model=schemas.DocumentListResponse)
def get_all_documents():
    try:
        shared_data_path = "./uploads/"

        files = [
            f
            for f in os.listdir(shared_data_path)
            if os.path.isfile(os.path.join(shared_data_path, f))
        ]
        return schemas.DocumentListResponse(
            documents=[schemas.File(filename=f) for f in files]
        )
    except FileNotFoundError:
        print(f"The directory '{shared_data_path}' does not exist.")
        return schemas.DocumentListResponse(documents=[])
    except Exception as e:
        print(f"An error occurred: {e}")
        return schemas.DocumentListResponse(documents=[])


@router.delete("/data")
async def delete_all_data(db: AsyncSession = Depends(get_db)):
    try:
        success = await crud.delete_all_data(db)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete all data.")
        return {"message": "All data from all tables has been deleted."}
    except Exception as e:
        logger.error(f"Error deleting all data: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/doc/{filename}", response_class=FileResponse)
async def get_doc(filename: str):
    some_file_path = f"./uploads/{filename}"

    if not os.path.exists(some_file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(some_file_path, media_type="application/pdf")
