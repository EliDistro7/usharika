'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Edit3, Trash2, Eye, Download, Search, Filter, Plus, Save, X, Image as ImageIcon, Send, Loader2, Check, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// Mfumo wa API - Badilisha URL hii kulingana na backend yako
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER;

// Cloudinary Configuration - BADILISHA HIZI!
const CLOUDINARY_CLOUD_NAME = 'dazho7cnj'; // Cloud name yako
const CLOUDINARY_UPLOAD_PRESET = 'audio_assets'; // Upload preset yako

const PDFAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('view'); // view, create
  const [pdfs, setPdfs] = useState([]);
  const [filteredPdfs, setFilteredPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stats, setStats] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'tangazo',
    tags: [],
    isPDF: false,
    file: null
  });
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewContent, setPreviewContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef(null);

  // Kategoria za matangazo
  const categories = [
    { value: 'all', label: 'Zote' },
    { value: 'tangazo', label: 'Matangazo' },
    { value: 'fomu', label: 'Fomu' },
    { value: 'barua', label: 'Barua Rasmi' },
    { value: 'taarifa', label: 'Taarifa' },
    { value: 'matukio', label: 'Matukio' },
    { value: 'ibada', label: 'Ratiba za Ibada' },
    { value: 'mafundisho', label: 'mafundisho' }
  ];

  // Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
  ];

  // Pakia PDF zote
  useEffect(() => {
    fetchPDFs();
    fetchStats();
  }, []);

  // Filter PDFs
  useEffect(() => {
    let filtered = pdfs;
    
    if (searchTerm) {
      filtered = filtered.filter(pdf => 
        pdf.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdf.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdf.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(pdf => pdf.category === selectedCategory);
    }
    
    setFilteredPdfs(filtered);
  }, [searchTerm, selectedCategory, pdfs]);

  const fetchPDFs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/pdfs?status=active`);
      const data = await response.json();
      console.log('Fetched PDFs:', data);
      if (data.success) {
        setPdfs(data.data);
        setFilteredPdfs(data.data);
      }
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      showNotification('Hitilafu wakati wa kupakia PDF', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pdfs/stats`);
      const data = await response.json();
      console.log('Fetched stats:', data);
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const showNotification = (message, type = 'success') => {
    if (type === 'error') {
      setError(message);
      setTimeout(() => setError(''), 5000);
    } else {
      setNotification(message);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleTagInputChange = (e) => {
    const input = e.target.value;
    setTagInput(input);

    if (input.includes(',')) {
      const newTags = input
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0 && !formData.tags.includes(tag));
      
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, ...newTags]
      }));
      setTagInput('');
    }
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTags = tagInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0 && !formData.tags.includes(tag));
      
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, ...newTags]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handlePredefinedTagClick = (tagName) => {
    if (!formData.tags.includes(tagName)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagName]
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setFormData(prev => ({ ...prev, file, isPDF: true }));
        setError('');
      } else {
        showNotification('Tafadhali chagua faili ya PDF tu', 'error');
        e.target.value = '';
      }
    }
  };

  const uploadToCloudinary = async (file) => {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
    
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formDataUpload.append('resource_type', 'raw');

    try {
      // Simulate progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        if (progress <= 90) {
          setUploadProgress(progress);
        }
      }, 200);

      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formDataUpload
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadProgress(100);

      return {
        url: data.secure_url,
        publicId: data.public_id,
        size: data.bytes
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showNotification('Kichwa cha tangazo kinahitajika', 'error');
      return;
    }

    if (!formData.isPDF && !formData.content.trim()) {
      showNotification('Maudhui ya tangazo yanahitajika', 'error');
      return;
    }

    if (formData.isPDF && !formData.file) {
      showNotification('Tafadhali chagua faili ya PDF', 'error');
      return;
    }

    setLoading(true);
    setError('');
    setUploadProgress(0);
    showNotification('Inahifadhi tangazo...', 'info');

    try {
      let pdfData = {
        fileName: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        mimeType: formData.isPDF ? 'application/pdf' : 'text/html'
      };

      if (formData.isPDF && formData.file) {
        // Upload PDF to Cloudinary
        const cloudinaryData = await uploadToCloudinary(formData.file);
        pdfData.cloudinaryUrl = cloudinaryData.url;
        pdfData.cloudinaryPublicId = cloudinaryData.publicId;
        pdfData.fileSize = cloudinaryData.size;
      } else {
        // Save HTML/rich text content
        pdfData.cloudinaryUrl = 'richtext://content';
        pdfData.cloudinaryPublicId = `richtext_${Date.now()}`;
        pdfData.fileSize = new Blob([formData.content]).size;
        pdfData.metadata = { content: formData.content };
      }

      const response = await fetch(`${API_BASE_URL}/pdfs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pdfData)
      });

      const result = await response.json();
      
      if (result.success) {
        showNotification('Tangazo limehifadhiwa kwa mafanikio!');
        resetForm();
        fetchPDFs();
        fetchStats();
        setActiveTab('view');
      } else {
        showNotification('Hitilafu: ' + result.message, 'error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showNotification('Hitilafu wakati wa kuhifadhi tangazo', 'error');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Je, una uhakika unataka kufuta tangazo hili?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/pdfs/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.success) {
        showNotification('Tangazo limefutwa kwa mafanikio!');
        fetchPDFs();
        fetchStats();
      }
    } catch (error) {
      console.error('Delete error:', error);
      showNotification('Hitilafu wakati wa kufuta', 'error');
    }
  };

  const handlePreview = (content) => {
    setPreviewContent(content);
    setShowPreview(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      category: 'tangazo',
      tags: [],
      isPDF: false,
      file: null
    });
    setTagInput('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('sw-TZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPdfs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPdfs.length / itemsPerPage);

  return (
    <div className="min-h-screen ">
      {/* Notifications */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className="bg-success-500 text-white px-6 py-4 rounded-xl shadow-primary-lg flex items-center gap-3">
            <Check size={20} />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className="bg-error-500 text-white px-6 py-4 rounded-xl shadow-primary-lg flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className=" shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-text-primary">
                Usimamizi wa Matangazo
              </h1>
              <p className="text-text-secondary mt-1">
                Simamia matangazo na PDF za kanisa
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('create')}
                className="flex items-center gap-2 px-6 py-3 bg-primary-gradient text-white rounded-xl hover:shadow-primary-lg transition-all duration-300"
              >
                <Plus size={20} />
                <span>Tangazo Jipya</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && activeTab === 'view' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-border-light hover:shadow-medium transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Jumla ya Matangazo</p>
                  <p className="text-3xl font-bold text-primary-600 mt-1">
                    {stats.totalPDFs}
                  </p>
                </div>
                <FileText className="text-primary-400" size={40} />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-border-light hover:shadow-medium transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Jumla ya Ukubwa</p>
                  <p className="text-3xl font-bold text-lavender-600 mt-1">
                    {formatFileSize(stats.totalSize)}
                  </p>
                </div>
                <ImageIcon className="text-lavender-400" size={40} />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-border-light hover:shadow-medium transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Vipakuliwa</p>
                  <p className="text-3xl font-bold text-peaceful-600 mt-1">
                    {stats.totalDownloads}
                  </p>
                </div>
                <Download className="text-peaceful-400" size={40} />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-border-light hover:shadow-medium transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Maoni</p>
                  <p className="text-3xl font-bold text-gold-600 mt-1">
                    {stats.totalViews}
                  </p>
                </div>
                <Eye className="text-gold-400" size={40} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Tab */}
        {activeTab === 'view' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-border-light">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={20} />
                  <input
                    type="text"
                    placeholder="Tafuta matangazo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={20} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 appearance-none bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* PDF List */}
            <div className="bg-white rounded-2xl shadow-soft border border-border-light overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <Loader2 className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" />
                  <p className="text-text-secondary">Inapakia...</p>
                </div>
              ) : currentItems.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="mx-auto text-text-tertiary mb-4" size={48} />
                  <p className="text-text-secondary text-lg">Hakuna matangazo</p>
                  <p className="text-text-tertiary text-sm mt-2">Anza kutengeneza tangazo la kwanza!</p>
                </div>
              ) : (
                <div className="divide-y divide-border-light">
                  {currentItems.map((pdf) => (
                    <div key={pdf._id} className="p-6 hover:bg-background-100 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-text-primary">
                              {pdf.fileName}
                            </h3>
                            <span className="px-3 py-1 bg-lavender-100 text-lavender-700 rounded-full text-xs font-medium">
                              {categories.find(c => c.value === pdf.category)?.label || pdf.category}
                            </span>
                            {pdf.mimeType === 'text/html' && (
                              <span className="px-3 py-1 bg-peaceful-100 text-peaceful-700 rounded-full text-xs font-medium">
                                Rich Text
                              </span>
                            )}
                          </div>
                          
                          {pdf.description && (
                            <p className="text-text-secondary mb-3">{pdf.description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {pdf.tags?.map((tag, idx) => (
                              <span key={idx} className="px-2 py-1 bg-background-300 text-text-secondary rounded-lg text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-text-tertiary">
                            <span>{formatFileSize(pdf.fileSize)}</span>
                            <span>•</span>
                            <span>{formatDate(pdf.createdAt)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Download size={14} />
                              {pdf.downloadCount}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye size={14} />
                              {pdf.viewCount}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {(pdf.mimeType === 'text/html' || pdf.mimeType === 'text/markdown') && (
                            <button
                              onClick={() => handlePreview(pdf.metadata?.content)}
                              className="p-2 text-peaceful-600 hover:bg-peaceful-50 rounded-lg transition-colors"
                              title="Angalia"
                            >
                              <Eye size={20} />
                            </button>
                          )}
                          
                          {pdf.mimeType === 'application/pdf' && (
                            <a
                              href={pdf.cloudinaryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Pakua"
                            >
                              <Download size={20} />
                            </a>
                          )}
                          
                          <button
                            onClick={() => handleDelete(pdf._id)}
                            className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                            title="Futa"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-border-light flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-border-default rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-100 transition-colors"
                  >
                    Nyuma
                  </button>
                  
                  <span className="text-text-secondary">
                    Ukurasa {currentPage} wa {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-border-default rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-100 transition-colors"
                  >
                    Mbele
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create/Upload Tab */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-2xl p-8 shadow-soft border border-border-light">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-text-primary">
                Tangazo Jipya
              </h2>
              <button
                onClick={() => {
                  setActiveTab('view');
                  resetForm();
                }}
                className="p-2 hover:bg-background-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Kichwa cha Tangazo *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Ingiza kichwa cha tangazo..."
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Maelezo Mafupi
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Maelezo mafupi ya tangazo..."
                  disabled={loading}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Kategoria *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
                  disabled={loading}
                >
                  {categories.filter(c => c.value !== 'all').map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Lebo (Tags)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyPress={handleTagKeyPress}
                  className="w-full px-4 py-3 border border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Bonyeza Enter kuongeza lebo..."
                  disabled={loading}
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1 bg-lavender-100 text-lavender-700 rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-lavender-900"
                        

                            disabled={loading}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Aina ya Tangazo *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isPDF: false, file: null }))}
                    className={`p-6 border-2 rounded-xl transition-all ${
                      !formData.isPDF
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-border-default hover:border-border-dark'
                    }`}
                    disabled={loading}
                  >
                    <Edit3 className={`mx-auto mb-3 ${!formData.isPDF ? 'text-primary-600' : 'text-text-tertiary'}`} size={32} />
                    <p className={`font-medium ${!formData.isPDF ? 'text-primary-700' : 'text-text-secondary'}`}>
                      Tangazo la Kawaida
                    </p>
                    <p className="text-sm text-text-tertiary mt-1">
                      Andika kwa Rich Text Editor
                    </p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isPDF: true, content: '' }))}
                    className={`p-6 border-2 rounded-xl transition-all ${
                      formData.isPDF
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-border-default hover:border-border-dark'
                    }`}
                    disabled={loading}
                  >
                    <Upload className={`mx-auto mb-3 ${formData.isPDF ? 'text-primary-600' : 'text-text-tertiary'}`} size={32} />
                    <p className={`font-medium ${formData.isPDF ? 'text-primary-700' : 'text-text-secondary'}`}>
                      Pakia PDF
                    </p>
                    <p className="text-sm text-text-tertiary mt-1">
                      Fomu au barua rasmi
                    </p>
                  </button>
                </div>
              </div>

              {/* Content or File Upload */}
              {!formData.isPDF ? (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Maudhui ya Tangazo *
                  </label>
                  <div className="border border-border-default rounded-xl overflow-hidden">
                    <ReactQuill
                      value={formData.content}
                      onChange={handleContentChange}
                      placeholder="Andika maudhui ya tangazo hapa..."
                      theme="snow"
                      modules={quillModules}
                      formats={quillFormats}
                      readOnly={loading}
                      style={{ minHeight: '300px' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePreview(formData.content)}
                    className="mt-3 flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    disabled={loading || !formData.content}
                  >
                    <Eye size={18} />
                    Angalia Muundo
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Chagua Faili ya PDF *
                  </label>
                  <div className="border-2 border-dashed border-border-default rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
                    <Upload className="mx-auto text-text-tertiary mb-3" size={48} />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-upload"
                      disabled={loading}
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="cursor-pointer text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Bofya kupakua PDF
                    </label>
                    {formData.file && (
                      <div className="mt-4">
                        <p className="text-sm text-success-600 flex items-center justify-center gap-2">
                          <Check size={16} />
                          {formData.file.name} ({formatFileSize(formData.file.size)})
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-text-tertiary mt-3">
                      Ukubwa wa juu: 10MB • Aina: PDF tu
                    </p>
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-primary-600">
                          Inapakia PDF...
                        </span>
                        <span className="text-sm font-medium text-primary-600">
                          {uploadProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-background-300 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary-gradient h-full transition-all duration-300 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary-gradient text-white rounded-xl hover:shadow-primary-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Inahifadhi...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Hifadhi Tangazo</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="px-6 py-4 border-2 border-border-default text-text-secondary rounded-xl hover:bg-background-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Futa Yote
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-primary-lg">
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <h3 className="text-xl font-display font-bold text-text-primary">
                Angalia Muundo
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-background-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: previewContent || '<p class="text-text-tertiary">Hakuna maudhui ya kuonyesha</p>' }}
              />
            </div>
            
            <div className="p-6 border-t border-border-light flex justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-3 bg-primary-gradient text-white rounded-xl hover:shadow-primary-lg transition-all duration-300"
              >
                Funga
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFAdminDashboard;