import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { ruleService } from '../services/ruleService';

const UploadRules = () => {
  const [file, setFile] = useState(null);
  const [overwrite, setOverwrite] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['.csv', '.xlsx', '.xls'];
      const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
      
      if (validTypes.includes(fileExtension)) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a CSV or Excel file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const uploadResult = await ruleService.uploadRules(file, overwrite);
      setResult(uploadResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResult(null);
    setError('');
    setOverwrite(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="flex items-center mb-6">
        <Upload className="w-6 h-6 text-primary-500 mr-2" />
        <h2 className="text-2xl font-bold">Upload Rules</h2>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100">
          {!result ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Rules File
                </label>
                <div className="border-2 border-dashed border-primary-300 rounded-xl p-8 text-center bg-gradient-to-b from-primary-50 to-white hover:from-primary-100 hover:to-gray-50 transition-all duration-200">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-primary-600 hover:text-primary-800 font-semibold text-lg"
                  >
                    Click to select your rules file
                  </label>
                  <p className="text-sm text-gray-600 mt-3 font-medium">
                    📊 Supported formats: CSV, Excel (.xlsx, .xls)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum file size: 10MB
                  </p>
                </div>
                
                {file && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-800">{file.name}</p>
                          <p className="text-sm text-green-600">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <div className="text-green-500">
                        <FileText className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="overwrite"
                  checked={overwrite}
                  onChange={(e) => setOverwrite(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="overwrite" className="text-sm text-gray-700">
                  Overwrite existing rules with same ID
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Rules'}
                </button>
                <button
                  onClick={resetUpload}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-700">Upload Complete!</h3>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Upload Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Upload ID:</strong> {result.uploadId}</div>
                  <div><strong>Status:</strong> {result.status}</div>
                  <div><strong>Created:</strong> {result.created}</div>
                  <div><strong>Updated:</strong> {result.updated}</div>
                  <div><strong>Failed:</strong> {result.failed}</div>
                </div>

                {result.errors && result.errors.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-red-700 mb-2">Errors:</h5>
                    <div className="space-y-1">
                      {result.errors.map((error, index) => (
                        <div key={index} className="text-sm text-red-600">
                          Row {error.row}: {error.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.reportUrl && (
                  <div className="mt-4">
                    <a
                      href={result.reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                      View Detailed Report →
                    </a>
                  </div>
                )}
              </div>

              <button
                onClick={resetUpload}
                className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Upload Another File
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UploadRules;