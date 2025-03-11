

// pages/SeriesManagementPage.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import SeriesList from '@/components/series/SeriesList2';
import CreateSeriesForm from '@/components/series/CreateSeriesForm';

import {
  createSeries,
  getAllSeries,
  deleteSeries,
  // other actions like getSingleSeries, addSession, etc.
} from '@/actions/series'; // adjust the import path as needed
import Cookies from 'js-cookie';



const SeriesManagementPage = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [seriesList, setSeriesList] = useState([]);
  const [newSeries, setNewSeries] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    author: '',
  });
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Fetch all series on mount or when refreshFlag changes
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const data = await getAllSeries({author: Cookies.get('role')});
       // console.log('series', data);
        setSeriesList(data);
      } catch (error) {
        alert(error.message);
      }
    };
    fetchSeries();
  }, [refreshFlag]);

  // Create Series handler
  const handleCreateSeries = async (e) => {
    e.preventDefault();
    try {
      newSeries.author = Cookies.get('role');
      await createSeries(newSeries);
      alert('Series created successfully!');
      setNewSeries({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        author: '',
      });
      setActiveTab('view');
      setRefreshFlag(!refreshFlag);
    } catch (error) {
      alert(error.message);
    }
  };

  // Delete Series handler (assumes author is needed in the delete request)
  const handleDeleteSeries = async (seriesId, seriesAuthor) => {
    if (window.confirm('Are you sure you want to delete this series?')) {
      try {
        // Using object with seriesId and author based on our updated API helper
        await deleteSeries({ seriesId, author: seriesAuthor });
        alert('Series deleted successfully!');
        setRefreshFlag(!refreshFlag);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="container my-4 ">
   
      <h1 className="mb-4">
        <i className="fa fa-tv"></i>  Series/campaigns
      </h1>
      <Tabs
        id="series-management-tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab
          eventKey="view"
          title={
            <span>
              <i className="fa fa-list"></i> Orodha
            </span>
          }
        >
          <SeriesList seriesList={seriesList} onDeleteSeries={handleDeleteSeries} />
        </Tab>
       
        {/* Additional tabs (e.g., editing sessions, updating attendance, etc.) can be added here */}
      </Tabs>
    </div>
  );
};

export default SeriesManagementPage;
