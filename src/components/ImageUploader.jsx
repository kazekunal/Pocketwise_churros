import React, { useState } from 'react';

const ImageUploader = ({ handleAddExpense }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null); // Clear any existing error when a new file is selected
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:3000/process-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.result) {
        const { store_name, grand_total } = result.result;

        if (!store_name || !grand_total) {
          setError("OCR processing failed to extract required information.");
          return;
        }

        const expenseDetails = {
          description: store_name || 'Unknown Store',
          amount: parseFloat(grand_total.replace(/[^\d.-]/g, '')),
          category: 'shopping',
          notes: 'Added via OCR',
        };

        handleAddExpense(expenseDetails);
      } else {
        setError('Failed to process image: ' + (result.error || 'No data returned'));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 bg-black rounded-lg">
      <div className="flex flex-col gap-4">
        <label className="relative flex items-center justify-center px-4 py-9 border-2 border-dashed border-gray-600 rounded-lg hover:border-green-500 transition-colors cursor-pointer bg-gray-900">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="text-center">
            <p className="text-gray-300 truncate max-w-md">
              {file ? file.name : 'Click or drag image to upload'}
            </p>
          </div>
        </label>
        
        <div className="relative w-full">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              'Upload and Add Expense'
            )}
          </button>
          {error && (
            <div className="absolute top-full mt-2 left-0 w-full p-2 bg-red-900/50 border border-red-700 rounded-lg z-10">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;