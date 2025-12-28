'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Bell, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { createUpdate, getAllUpdates, updateUpdate, deleteUpdate } from '@/actions/updates';

const ChurchAdminUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    content: '',
    group: 'announcements'
  });

  const groups = [
    { value: 'news', label: 'Habari', icon: '📰', color: 'from-primary-500 to-primary-700' },
    { value: 'updates', label: 'Matangazo', icon: '🔔', color: 'from-lavender-500 to-lavender-700' },
    { value: 'alerts', label: 'Tahadhari', icon: '⚠️', color: 'from-gold-400 to-gold-600' },
    { value: 'announcements', label: 'Taarifa', icon: '📢', color: 'from-peaceful-500 to-peaceful-700' }
  ];

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const data = await getAllUpdates();
      setUpdates(data);
    } catch (error) {
      showNotification('Hitilafu katika kupakia matangazo', 'error');
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      showNotification('Tafadhali jaza maudhui', 'error');
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingId) {
        await updateUpdate({ 
          id: editingId, 
          content: formData.content, 
          group: formData.group 
        });
        setUpdates(updates.map(u => 
          u._id === editingId 
            ? { ...u, content: formData.content, group: formData.group }
            : u
        ));
        showNotification('Tangazo limebadilishwa kwa mafanikio!', 'success');
      } else {
        const newUpdate = await createUpdate({ 
          content: formData.content, 
          group: formData.group 
        });
        setUpdates([newUpdate, ...updates]);
        showNotification('Tangazo limeongezwa kwa mafanikio!', 'success');
      }
      
      resetForm();
    } catch (error) {
      showNotification(error.message || 'Hitilafu imetokea', 'error');
      console.error('Error saving update:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (update) => {
    setFormData({
      content: update.content,
      group: update.group
    });
    setEditingId(update._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Una uhakika unataka kufuta tangazo hili?')) return;
    
    try {
      await deleteUpdate(id);
      setUpdates(updates.filter(u => u._id !== id));
      showNotification('Tangazo limefutwa kwa mafanikio!', 'success');
    } catch (error) {
      showNotification(error.message || 'Hitilafu katika kufuta', 'error');
      console.error('Error deleting update:', error);
    }
  };

  const resetForm = () => {
    setFormData({ content: '', group: 'announcements' });
    setEditingId(null);
    setShowForm(false);
  };

  const getGroupInfo = (groupValue) => {
    return groups.find(g => g.value === groupValue) || groups[0];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('sw-TZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block p-4 bg-primary-100 rounded-full mb-4">
            <Bell className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-3">
            Usimamizi wa Matangazo
          </h1>
          <p className="text-text-secondary text-lg">
            Dhibiti matangazo ya kanisa lako kwa urahisi
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 max-w-md animate-slide-down shadow-lavender-lg ${
            notification.type === 'success' 
              ? 'bg-success-50 border-success-500 text-success-700' 
              : 'bg-error-50 border-error-500 text-error-700'
          } border-l-4 p-4 rounded-lg`}>
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <p className="font-medium">{notification.message}</p>
            </div>
          </div>
        )}

        {/* Add Button */}
        {!showForm && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-primary-lg hover:shadow-primary transform hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-6 h-6" />
              Ongeza Tangazo Jipya
            </button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-lavender-lg p-8 mb-8 border-2 border-border-light animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-text-primary">
                {editingId ? 'Badilisha Tangazo' : 'Tangazo Jipya'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-background-300 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-text-tertiary" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Group Selection */}
              <div>
                <label className="block text-sm font-bold text-text-primary mb-3">
                  Aina ya Tangazo
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {groups.map((group) => (
                    <button
                      key={group.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, group: group.value })}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                        formData.group === group.value
                          ? 'border-primary-500 bg-primary-50 scale-105 shadow-primary'
                          : 'border-border-default bg-white hover:border-primary-300 hover:bg-primary-50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{group.icon}</div>
                      <div className="text-sm font-bold text-text-primary">
                        {group.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Input */}
              <div>
                <label className="block text-sm font-bold text-text-primary mb-3">
                  Maudhui ya Tangazo
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-border-default rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all resize-none text-text-primary"
                  rows="5"
                  placeholder="Andika tangazo lako hapa..."
                  required
                />
                <p className="text-sm text-text-tertiary mt-2">
                  Herufi {formData.content.length} | Unaweza kutumia URL kamili
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-border-medium rounded-xl font-bold text-text-secondary hover:bg-background-300 transition-all"
                  disabled={submitting}
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-3 rounded-xl font-bold shadow-primary hover:shadow-primary-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Inahifadhi...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingId ? 'Badilisha' : 'Hifadhi'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Updates List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
              <p className="text-text-secondary text-lg">Inapakia matangazo...</p>
            </div>
          ) : updates.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-soft">
              <Bell className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">
                Hakuna matangazo bado
              </h3>
              <p className="text-text-secondary">
                Bonyeza kitufe cha juu kuongeza tangazo la kwanza
              </p>
            </div>
          ) : (
            updates.map((update, index) => {
              const groupInfo = getGroupInfo(update.group);
              return (
                <div
                  key={update._id}
                  className="bg-white rounded-2xl shadow-soft hover:shadow-lavender border-2 border-border-light hover:border-primary-200 transition-all duration-300 p-6 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${groupInfo.color} flex items-center justify-center text-2xl shadow-soft`}>
                        {groupInfo.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${groupInfo.color}`}>
                          {groupInfo.label}
                        </span>
                        <span className="text-sm text-text-tertiary">
                          {formatDate(update.createdAt)}
                        </span>
                      </div>
                      <p className="text-text-primary leading-relaxed break-words">
                        {update.content}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(update)}
                        className="p-3 hover:bg-primary-50 rounded-xl transition-all group"
                        title="Badilisha"
                      >
                        <Edit2 className="w-5 h-5 text-text-tertiary group-hover:text-primary-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(update._id)}
                        className="p-3 hover:bg-error-50 rounded-xl transition-all group"
                        title="Futa"
                      >
                        <Trash2 className="w-5 h-5 text-text-tertiary group-hover:text-error-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Stats */}
        {!loading && updates.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-text-tertiary">
              Jumla ya matangazo: <span className="font-bold text-primary-600">{updates.length}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChurchAdminUpdates;