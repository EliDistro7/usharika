import React, { useState, useRef } from 'react';
import { Upload, File, X, Check, AlertCircle, Loader2, Download, Eye } from 'lucide-react';

// Cloudinary upload function
const uploadToCloudinary = async (file, onProgress) => {
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dazho7cnj/upload`;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'audio_assets');

  try {
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    // Simulate progress for better UX
    if (onProgress) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 90) {
          onProgress(progress);
        }
      }, 100);

      const data = await response.json();
      clearInterval(interval);
      onProgress(100);

      return {
        secureUrl: data.secure_url,
        publicId: data.public_id,
        mimeType: file.type,
        ...data,
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

const PDFUploadPage = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const fileObjects = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      status: 'pending', // pending, uploading, success, error
      progress: 0,
      url: null,
      publicId: null,
      error: null,
    }));

    setFiles(prev => [...prev, ...fileObjects]);
  };

  const uploadFile = async (fileObj) => {
    setFiles(prev => prev.map(f => 
      f.id === fileObj.id ? { ...f, status: 'uploading', progress: 0 } : f
    ));

    try {
      const result = await uploadToCloudinary(fileObj.file, (progress) => {
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, progress } : f
        ));
      });

      setFiles(prev => prev.map(f => 
        f.id === fileObj.id 
          ? { ...f, status: 'success', url: result.secureUrl, publicId: result.publicId } 
          : f
      ));
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id 
          ? { ...f, status: 'error', error: error.message } 
          : f
      ));
    }
  };

  const uploadAll = () => {
    files.forEach(file => {
      if (file.status === 'pending') {
        uploadFile(file);
      }
    });
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const pendingFiles = files.filter(f => f.status === 'pending').length;
  const successFiles = files.filter(f => f.status === 'success').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-100 via-background-200 to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-gradient rounded-3xl shadow-primary-lg mb-6">
            <Upload className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-display font-bold text-text-primary mb-4">
            Upload PDF Documents
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Drag and drop your PDF files or click to browse. Your files will be securely uploaded to the cloud.
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-8 animate-slide-up">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer
              transition-all duration-300 bg-white/80 backdrop-blur-sm
              ${isDragging 
                ? 'border-primary-500 bg-primary-50/50 shadow-primary-lg scale-[1.02]' 
                : 'border-border-default hover:border-primary-400 hover:bg-primary-50/30 hover:shadow-medium'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
            
            <div className="flex flex-col items-center">
              <div className={`
                w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300
                ${isDragging ? 'bg-primary-500 scale-110' : 'bg-primary-100'}
              `}>
                <Upload className={`w-12 h-12 ${isDragging ? 'text-white' : 'text-primary-600'}`} />
              </div>
              
              <h3 className="text-2xl font-semibold text-text-primary mb-2">
                {isDragging ? 'Drop your files here' : 'Drop PDF files here'}
              </h3>
              <p className="text-text-secondary mb-6">
                or click to browse from your computer
              </p>
              
              <button className="btn-primary shadow-primary">
                Choose Files
              </button>
              
              <p className="text-sm text-text-tertiary mt-4">
                Supports: PDF files only • Max size: 10MB per file
              </p>
            </div>
          </div>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="animate-slide-up">
            {/* Action Bar */}
            <div className="bg-white rounded-2xl shadow-medium p-6 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-text-primary">
                  <span className="font-semibold text-2xl">{files.length}</span>
                  <span className="text-text-secondary ml-2">files selected</span>
                </div>
                {successFiles > 0 && (
                  <div className="flex items-center gap-2 text-success-600">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">{successFiles} uploaded</span>
                  </div>
                )}
              </div>
              
              {pendingFiles > 0 && (
                <button
                  onClick={uploadAll}
                  className="btn-primary shadow-primary flex items-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Upload All ({pendingFiles})
                </button>
              )}
            </div>

            {/* File Cards */}
            <div className="space-y-4">
              {files.map((fileObj) => (
                <div
                  key={fileObj.id}
                  className="bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 p-6 animate-scale-in"
                >
                  <div className="flex items-start gap-4">
                    {/* File Icon */}
                    <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0
                      ${fileObj.status === 'success' ? 'bg-success-100' : 
                        fileObj.status === 'error' ? 'bg-error-100' : 
                        fileObj.status === 'uploading' ? 'bg-primary-100' : 
                        'bg-background-300'}
                    `}>
                      {fileObj.status === 'success' ? (
                        <Check className="w-7 h-7 text-success-600" />
                      ) : fileObj.status === 'error' ? (
                        <AlertCircle className="w-7 h-7 text-error-600" />
                      ) : fileObj.status === 'uploading' ? (
                        <Loader2 className="w-7 h-7 text-primary-600 animate-spin" />
                      ) : (
                        <File className="w-7 h-7 text-text-tertiary" />
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-text-primary truncate">
                            {fileObj.name}
                          </h4>
                          <p className="text-sm text-text-tertiary">
                            {formatFileSize(fileObj.size)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {fileObj.status === 'pending' && (
                            <button
                              onClick={() => uploadFile(fileObj)}
                              className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                              title="Upload"
                            >
                              <Upload className="w-5 h-5" />
                            </button>
                          )}
                          
                          {fileObj.status === 'success' && (
                            <>
                              <a
                                href={fileObj.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                                title="View"
                              >
                                <Eye className="w-5 h-5" />
                              </a>
                              <a
                                href={fileObj.url}
                                download
                                className="p-2 hover:bg-success-50 rounded-lg transition-colors text-success-600"
                                title="Download"
                              >
                                <Download className="w-5 h-5" />
                              </a>
                            </>
                          )}
                          
                          <button
                            onClick={() => removeFile(fileObj.id)}
                            className="p-2 hover:bg-error-50 rounded-lg transition-colors text-error-600"
                            title="Remove"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {fileObj.status === 'uploading' && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-primary-600">
                              Uploading...
                            </span>
                            <span className="text-sm font-medium text-primary-600">
                              {fileObj.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-background-300 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-primary-gradient h-full transition-all duration-300 rounded-full"
                              style={{ width: `${fileObj.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Error Message */}
                      {fileObj.status === 'error' && (
                        <div className="mt-3 flex items-center gap-2 text-error-600 bg-error-50 p-3 rounded-lg">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">
                            {fileObj.error || 'Upload failed. Please try again.'}
                          </span>
                        </div>
                      )}

                      {/* Success Message */}
                      {fileObj.status === 'success' && (
                        <div className="mt-3 flex items-center gap-2 text-success-600 bg-success-50 p-3 rounded-lg">
                          <Check className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm font-medium">
                            Successfully uploaded to Cloudinary
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {files.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-background-300 rounded-2xl mb-4">
              <File className="w-8 h-8 text-text-tertiary" />
            </div>
            <p className="text-text-secondary">
              No files selected yet. Upload your first PDF to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFUploadPage;