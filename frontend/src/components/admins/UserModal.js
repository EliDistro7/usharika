import { formatRoleName } from '@/actions/utils';
import React, { useState } from 'react';
import { X, User, Crown, Heart, Phone, Briefcase, Users } from 'lucide-react';

const UserModal = ({ show, onClose, user }) => {
  //console.log('user', user);
  const [activeTab, setActiveTab] = useState('profile');

  if (!user || !show) return null;

  // Convert leadershipPositions from Map (or object) into an object if needed
  const leadershipPositionsObj =
    user.leadershipPositions && typeof user.leadershipPositions === 'object'
      ? user.leadershipPositions
      : {};

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'leadership', label: 'Uongozi', icon: Crown },
    { id: 'offerings', label: 'SADAKA', icon: Heart },
  ];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-strong max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-primary-800">Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary-200 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-primary-600" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border-light bg-background-50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white border-b-2 border-primary-600 text-primary-700 shadow-sm'
                    : 'text-text-secondary hover:text-primary-600 hover:bg-primary-25'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 bg-gradient-to-br from-background-50 to-background-100 max-h-[60vh] overflow-y-auto">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={user.profilePicture || 'https://via.placeholder.com/120'}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary-200 shadow-medium"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success-500 rounded-full border-2 border-white"></div>
                </div>
                <h3 className="text-2xl font-bold text-primary-800 mb-2">{user.name}</h3>
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100 rounded-full">
                  <Users className="w-4 h-4 text-primary-600" />
                  <span className="text-primary-700 font-medium">{user.jumuiya}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-soft border border-border-light">
                  <div className="flex items-center space-x-3 mb-2">
                    <Heart className="w-5 h-5 text-primary-600" />
                    <span className="font-semibold text-primary-800">Hali ya Ndoa</span>
                  </div>
                  <p className="text-text-primary ml-8">{user.maritalStatus}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-soft border border-border-light">
                  <div className="flex items-center space-x-3 mb-2">
                    <Briefcase className="w-5 h-5 text-primary-600" />
                    <span className="font-semibold text-primary-800">Kazi</span>
                  </div>
                  <p className="text-text-primary ml-8">{user.occupation}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-soft border border-border-light">
                  <div className="flex items-center space-x-3 mb-2">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <span className="font-semibold text-primary-800">Simu</span>
                  </div>
                  <p className="text-text-primary ml-8">{user.phone}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-soft border border-border-light">
                  <div className="flex items-center space-x-3 mb-2">
                    <User className="w-5 h-5 text-primary-600" />
                    <span className="font-semibold text-primary-800">Jinsia</span>
                  </div>
                  <p className="text-text-primary ml-8">{user.gender}</p>
                </div>
              </div>
            </div>
          )}

          {/* Leadership Tab */}
          {activeTab === 'leadership' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 mb-4">
                  <Crown className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-2xl font-bold text-primary-800">Nafasi za Uongozi</h3>
                </div>
              </div>

              {Object.keys(leadershipPositionsObj).length > 0 ? (
                <div className="bg-white rounded-2xl shadow-soft border border-border-light overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-primary-50 to-primary-100">
                        <tr>
                          <th className="px-6 py-4 text-left font-bold text-primary-800">#</th>
                          <th className="px-6 py-4 text-left font-bold text-primary-800">Kundi</th>
                          <th className="px-6 py-4 text-left font-bold text-primary-800">Nafasi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(leadershipPositionsObj).map(
                          ([group, positions], index) => (
                            <tr 
                              key={group}
                              className={`border-b border-border-light hover:bg-primary-25 transition-colors duration-200 ${
                                index % 2 === 0 ? 'bg-background-50' : 'bg-white'
                              }`}
                            >
                              <td className="px-6 py-4 font-medium text-text-primary">{index + 1}</td>
                              <td className="px-6 py-4 font-semibold text-primary-700">
                                {formatRoleName(group.replace('kiongozi_', ''))}
                              </td>
                              <td className="px-6 py-4 text-text-primary">
                                {positions && positions.length > 0
                                  ? positions.join(', ')
                                  : 'Hakuna Nafasi'}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-warning-50 to-warning-100 border border-warning-200 p-6 rounded-2xl text-center">
                  <Crown className="w-16 h-16 text-warning-400 mx-auto mb-4" />
                  <p className="text-warning-700 font-medium text-lg">Hakuna Nafasi za Uongozi.</p>
                </div>
              )}
            </div>
          )}

          {/* Offerings/SADAKA Tab */}
          {activeTab === 'offerings' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 mb-4">
                  <Heart className="w-6 h-6 text-error-600" />
                  <h3 className="text-2xl font-bold text-primary-800">SADAKA</h3>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-soft border border-border-light overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-primary-50 to-primary-100">
                      <tr>
                        <th className="px-6 py-4 text-left font-bold text-primary-800">#</th>
                        <th className="px-6 py-4 text-left font-bold text-primary-800">Aina ya Ahadi</th>
                        <th className="px-6 py-4 text-left font-bold text-primary-800">Jumla ya Ahadi (TZS)</th>
                        <th className="px-6 py-4 text-left font-bold text-primary-800">Iliyolipwa (TZS)</th>
                        <th className="px-6 py-4 text-left font-bold text-primary-800">Baki (TZS)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Default Pledge: Ahadi */}
                      <tr className="border-b border-border-light hover:bg-primary-25 transition-colors duration-200 bg-background-50">
                        <td className="px-6 py-4 font-medium text-text-primary">1</td>
                        <td className="px-6 py-4 font-semibold text-primary-700">Ahadi</td>
                        <td className="px-6 py-4 text-text-primary font-medium">
                          {user.pledges.ahadi.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-success-600 font-medium">
                          {user.pledges.paidAhadi.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-warning-600 font-bold">
                          {(user.pledges.ahadi - user.pledges.paidAhadi).toLocaleString()}
                        </td>
                      </tr>

                      {/* Default Pledge: Jengo */}
                      <tr className="border-b border-border-light hover:bg-primary-25 transition-colors duration-200 bg-white">
                        <td className="px-6 py-4 font-medium text-text-primary">2</td>
                        <td className="px-6 py-4 font-semibold text-primary-700">Jengo</td>
                        <td className="px-6 py-4 text-text-primary font-medium">
                          {user.pledges.jengo.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-success-600 font-medium">
                          {user.pledges.paidJengo.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-warning-600 font-bold">
                          {(user.pledges.jengo - user.pledges.paidJengo).toLocaleString()}
                        </td>
                      </tr>

                      {/* Dynamic Pledges from 'other' */}
                      {user.pledges.other &&
                        Object.keys(user.pledges.other).length > 0 &&
                        Object.entries(user.pledges.other).map(
                          ([key, { total, paid }], index) => (
                            <tr 
                              key={key}
                              className={`border-b border-border-light hover:bg-primary-25 transition-colors duration-200 ${
                                (index + 2) % 2 === 0 ? 'bg-background-50' : 'bg-white'
                              }`}
                            >
                              <td className="px-6 py-4 font-medium text-text-primary">{index + 3}</td>
                              <td className="px-6 py-4 font-semibold text-primary-700">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </td>
                              <td className="px-6 py-4 text-text-primary font-medium">
                                {total.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-success-600 font-medium">
                                {paid.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-warning-600 font-bold">
                                {(total - paid).toLocaleString()}
                              </td>
                            </tr>
                          )
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-t border-primary-200">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-primary-300 text-primary-700 font-medium rounded-xl hover:bg-primary-100 transition-all duration-200"
          >
            Funga
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;