'use client';

import React from 'react';

const SeriesSidebar = ({ 
  series, 
  user, 
  totalSessions, 
  completedSessions 
}) => {
  return (
    <div className="space-y-6">
      {/* Series Stats Card */}
      <div className="bg-background-50 rounded-xl shadow-soft border border-border-light overflow-hidden">
        <div className="bg-background-200 px-6 py-4 border-b-2 border-yellow-500">
          <h5 className="text-lg font-semibold text-text-primary">Series Stats</h5>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary font-medium">Total Sessions</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              {totalSessions}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary font-medium">Completed</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-800">
              {completedSessions}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary font-medium">Remaining</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              {totalSessions - completedSessions}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary font-medium">Total Attendance</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {series.totalAttendance || 0}
            </span>
          </div>
        </div>
      </div>
      
      {/* Quick Actions Card */}
      <div className="bg-background-50 rounded-xl shadow-soft border border-border-light overflow-hidden">
        <div className="bg-background-200 px-6 py-4 border-b-2 border-primary-500">
          <h5 className="text-lg font-semibold text-text-primary">Quick Actions</h5>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share Series
            </button>
            
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-success-500 text-success-600 hover:bg-success-500 hover:text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download All
            </button>
            
            {user && (
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Mark as Favorite
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Series Info Card */}
      <div className="bg-background-50 rounded-xl shadow-soft border border-border-light overflow-hidden">
        <div className="bg-background-200 px-6 py-4 border-b-2 border-green-500">
          <h5 className="text-lg font-semibold text-text-primary">Series Info</h5>
        </div>
        <div className="p-6 space-y-3">
          <div>
            <span className="text-text-secondary text-sm font-medium">Created by</span>
            <p className="text-text-primary font-semibold">{series.author}</p>
          </div>
          <div>
            <span className="text-text-secondary text-sm font-medium">Start Date</span>
            <p className="text-text-primary">{new Date(series.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-text-secondary text-sm font-medium">End Date</span>
            <p className="text-text-primary">{new Date(series.endDate).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-text-secondary text-sm font-medium">Status</span>
            <p className="text-text-primary">
              {new Date() > new Date(series.endDate) ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Completed
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  Active
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-background-50 rounded-xl shadow-soft border border-border-light overflow-hidden">
        <div className="bg-background-200 px-6 py-4 border-b-2 border-purple-500">
          <h5 className="text-lg font-semibold text-text-primary">Progress</h5>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary font-medium">Completion</span>
              <span className="text-text-primary font-semibold">
                {totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-background-300 rounded-full h-2">
              <div 
                className="bg-primary-gradient h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0}%` 
                }}
              ></div>
            </div>
            <p className="text-text-tertiary text-sm">
              {completedSessions} of {totalSessions} sessions completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesSidebar;