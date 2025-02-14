import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Flashcard } from './domain/FlashCard';
import Flashcards from './Flashcards';


function PDFUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [flashCardData, setFlashCardData] = useState<Flashcard[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
    }
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
  }, []);

  const handleUpload = useCallback(async () => {
    setIsLoading(true);

    if (!file) return;

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post('http://localhost:6969/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFlashCardData(response.data);
      console.log('File uploaded successfully:', response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsLoading(false);
    }

  }, [file]);

  if (flashCardData.length > 0) {
    return <Flashcards flashCardData={flashCardData} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-8">
          <span className="material-symbols-rounded text-3xl text-indigo-600 mr-3">upload_file</span>
          <h1 className="text-3xl font-bold text-gray-800">PDF Upload</h1>
        </div>

        {!file ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 transition-colors ${isDragging
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-indigo-400'
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center">
              <span className="material-symbols-rounded text-4xl text-gray-400 mb-4">cloud_upload</span>
              <p className="text-lg text-gray-600 text-center mb-4">
                Drag and drop your PDF here, or{' '}
                <label className="text-indigo-600 hover:text-indigo-700 cursor-pointer">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500">Only PDF files are supported</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="material-symbols-rounded text-2xl text-indigo-600">description</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <span className="material-symbols-rounded text-xl text-gray-500">close</span>
              </button>
            </div>

            {/* <button
              onClick={handleUpload}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span className="material-symbols-rounded">upload</span>
              <span>Upload PDF</span>
            </button> */}

            <button
              onClick={handleUpload}
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
            >
              {isLoading ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
              ) : (
                <span className="material-symbols-rounded">upload</span>
              )}
              <span>{isLoading ? "Uploading..." : "Upload PDF"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PDFUpload;