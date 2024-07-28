'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStoreDisplaySettings } from '@/store';
import LoadingPDF from './LoadingPDF';
import { fetchPdfDocument } from '@/lib/api';

const PdfViewer: React.FC<{}> = () => {
  const { displayFile } = useStoreDisplaySettings();

  const {
    data: filePath,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`pdf-${displayFile}`],
    queryFn: () => fetchPdfDocument(displayFile),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 items-center mt-20 w-full justify-center">
        Loading PDF document...
        <LoadingPDF />
      </div>
    );
  }

  if (error) {
    return <div>Error loading PDF document: {(error as Error).message}</div>;
  }

  return (
    <div className="w-full h-full flex justify-center items-center ">
      <iframe
        src={filePath ?? ''}
        className="w-full h-full border"
        title="PDF Viewer"
      ></iframe>
    </div>
  );
};

export default PdfViewer;
