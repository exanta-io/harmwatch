'use client';
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadDocument } from '@/lib/api';
import { CloudArrowUp } from '@phosphor-icons/react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

interface FileUploadProps {
  setSelectedFile?: (filename: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ setSelectedFile }) => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = React.useState(false);

  const mutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: ({ filename, message }) => {
      queryClient.invalidateQueries({ queryKey: ['documents-list'] });
      if (setSelectedFile) {
        setSelectedFile(filename);
      }
      toast.success(message);
    },
    onError: (err) => {
      toast.error('Error uploading file');
      console.error(err);
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File too large');
        return;
      }

      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        mutation.mutate(formData);
      } catch (error) {
        console.error(error);
        toast.error('Unexpected error');
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="p-2 bg-white bg-gray-100 rounded-xl">
      <div
        {...getRootProps({
          className:
            'border-dashed border-base-content border-2 rounded-xl cursor-pointer bg-gray-100 py-8 flex justify-center items-center flex-col',
        })}
      >
        {uploading ? (
          <>
            <LoadingSpinner />
            <p className="mt-2 text-sm text-center text-slate-400">
              Uploading...
            </p>
          </>
        ) : (
          <>
            <input {...getInputProps()} />
            <CloudArrowUp size={32} />
            <p className="mt-2 text-sm text-base-100">Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
