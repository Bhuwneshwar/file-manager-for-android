import React, { useState } from "react";
import axios from "axios";
import { truncateText } from "./FileManager";

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setFiles([...files, ...Array.from(selectedFiles)]);
    }
  };

  // Handle drag-and-drop
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles) {
      setFiles([...files, ...Array.from(droppedFiles)]);
    }
  };

  // Remove a file
  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  // Handle upload
  const handleUpload = async () => {
    if (files.length === 0) {
      alert("No files selected!");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const { data } = await axios.post(`/api/v1/upload-files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        },
      });

      console.log("File uploaded successfully:", { data });

      if (data.success) {
        alert("Files uploaded successfully!");
        setFiles([]); // Clear the file list after successful upload
      } else {
        alert("File upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("An error occurred while uploading files.");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      {/* Drag-and-drop area */}
      <div
        className={`border-2 border-dashed ${
          isDragging ? "border-blue-500" : "border-gray-300"
        } rounded-lg p-6 text-center cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="text-gray-600">Drag and drop files here or</p>
        <label htmlFor="file-upload" className="text-blue-500 cursor-pointer">
          browse your device
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          multiple
          onChange={handleFileChange}
        />
      </div>

      {/* Display uploaded files */}
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Uploaded Files:</h3>
          <ul className="mt-2">
            {files.map((file, index) => (
              <li
                key={file.name}
                className="flex justify-between items-center p-2 border-b"
              >
                <span className="text-gray-700">
                  {truncateText(file.name, 25)}
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload Progress */}
      {isLoading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {/* Upload Button */}
      <div className="mt-6">
        <button
          onClick={handleUpload}
          disabled={isLoading || files.length === 0}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg ${
            isLoading || files.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600"
          } transition-colors`}
        >
          {isLoading ? "Uploading..." : "Upload Files"}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
