// pages/SeriesManagementPage.jsx
'use client';

import React, { useState, useEffect } from 'react';
import SeriesList from '@/components/series/SeriesList';
import CreateSeriesForm from '@/components/series/CreateSeriesForm';
import {
  createSeries,
  getAllSeries,
  deleteSeries,
  // other actions like getSingleSeries, addSession, etc.
} from '@/actions/series'; // adjust the import path as needed
import Cookies from 'js-cookie';
import CustomNavbar from '@/components/admins/CustomNavbar';
import { getDesanitezedCookie } from '@/hooks/useUser';
import { toast } from 'react-toastify';

const SeriesManagementPage = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [seriesList, setSeriesList] = useState([]);
  const [newSeries, setNewSeries] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    group: "",
    author: '',
  });
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Fetch all series on mount or when refreshFlag changes
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const data = await getAllSeries({ author: Cookies.get('role') });
        setSeriesList(data);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch series');
      }
    };
    fetchSeries();
  }, [refreshFlag]);

  // Create Series handler
  const handleCreateSeries = async (e) => {
    e.preventDefault();
    try {
      console.log('it opened handleCreateSeries');
      newSeries.author = getDesanitezedCookie();
      console.log('it reaches her', newSeries.author);
      newSeries.group = Cookies.get('role');
      console.log('it reaches her group', newSeries.group);
      
      await createSeries(newSeries);
      
      // Show success toast
      toast.success(`Series "${newSeries.name}" imeongezwa kikamilifu!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
     
      setNewSeries({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        group: '',
        author: '',
      });

      setActiveTab('view');
      setRefreshFlag(!refreshFlag);
    } catch (error) {
      console.log(error);
      toast.error(error.message || 'Kuna tatizo la kuongeza series. Jaribu tena.');
    }
  };

  // Delete Series handler
  const handleDeleteSeries = async (seriesId, seriesAuthor) => {
    if (window.confirm('Are you sure you want to delete this series?')) {
      try {
        await deleteSeries({ seriesId, author: seriesAuthor });
        toast.success('Series imefutwa kikamilifu!');
        setRefreshFlag(!refreshFlag);
      } catch (error) {
        toast.error(error.message || 'Failed to delete series');
      }
    }
  };

  const tabs = [
    {
      key: 'view',
      title: 'View Series',
      icon: 'fa-list',
      content: <SeriesList seriesList={seriesList} onDeleteSeries={handleDeleteSeries} />
    },
    {
      key: 'create',
      title: 'Create Series',
      icon: 'fa-plus',
      content: <CreateSeriesForm
        newSeries={newSeries}
        onChange={setNewSeries}
        onSubmit={handleCreateSeries}
      />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-50 to-background-300">
      {/* Navigation */}
      <CustomNavbar />
      
      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8 lg:mb-12 animate-fade-in">
          <div className="glass p-6 lg:p-8 rounded-3xl border border-border-light shadow-soft">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-text-primary mb-2">
              <i className="fa fa-tv text-primary-700 mr-3 lg:mr-4"></i>
              Series Management
            </h1>
            <p className="text-text-secondary text-sm sm:text-base lg:text-lg">
              Manage your training series, create new programs, and track progress
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 lg:mb-8">
          <div className="glass rounded-2xl p-2 border border-border-light shadow-medium">
            <nav className="flex flex-col sm:flex-row gap-2" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    relative flex-1 flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 
                    rounded-xl font-semibold text-sm sm:text-base transition-all duration-300
                    ${
                      activeTab === tab.key
                        ? 'bg-primary-gradient text-white shadow-primary transform scale-[1.02] sm:scale-105'
                        : 'text-text-secondary hover:text-text-primary hover:bg-background-100 hover:scale-[1.01]'
                    }
                  `}
                >
                  <i className={`fa ${tab.icon} mr-2 sm:mr-3 text-sm sm:text-base`}></i>
                  <span className="hidden sm:inline">{tab.title}</span>
                  <span className="sm:hidden text-xs">{tab.title.split(' ')[0]}</span>
                  
                  {/* Active indicator */}
                  {activeTab === tab.key && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          <div className="glass rounded-3xl border border-border-light shadow-medium overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              {tabs.find(tab => tab.key === activeTab)?.content}
            </div>
          </div>
        </div>

        {/* Stats Cards (Optional Enhancement) */}
        <div className="mt-8 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="glass p-4 sm:p-6 rounded-2xl border border-border-light shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-primary-gradient rounded-xl">
                <i className="fa fa-tv text-white text-lg"></i>
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-text-primary">
                {seriesList.length}
              </span>
            </div>
            <h3 className="text-text-primary font-semibold text-sm sm:text-base">Total Series</h3>
            <p className="text-text-tertiary text-xs sm:text-sm">Active training programs</p>
          </div>

          <div className="glass p-4 sm:p-6 rounded-2xl border border-border-light shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-secondary-gradient rounded-xl">
                <i className="fa fa-calendar text-white text-lg"></i>
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-text-primary">
                {seriesList.filter(s => new Date(s.endDate) >= new Date()).length}
              </span>
            </div>
            <h3 className="text-text-primary font-semibold text-sm sm:text-base">Active Series</h3>
            <p className="text-text-tertiary text-xs sm:text-sm">Currently running</p>
          </div>

          <div className="glass p-4 sm:p-6 rounded-2xl border border-border-light shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-accent-gradient rounded-xl">
                <i className="fa fa-users text-white text-lg"></i>
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-text-primary">
                {Cookies.get('role') || 'Admin'}
              </span>
            </div>
            <h3 className="text-text-primary font-semibold text-sm sm:text-base">Nafasi/Kikundi</h3>
            <p className="text-text-tertiary text-xs sm:text-sm">Usimamizi</p>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-80 h-80 bg-primary-gradient opacity-5 rounded-full blur-3xl animate-gentle-float"></div>
        <div className="absolute bottom-20 -left-20 w-60 h-60 bg-secondary-gradient opacity-5 rounded-full blur-3xl animate-gentle-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-gradient opacity-3 rounded-full blur-3xl animate-gentle-float" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
};

export default SeriesManagementPage;