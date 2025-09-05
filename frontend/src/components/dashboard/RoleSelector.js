'use client';
import React, { useState } from 'react';
import { formatRoleName } from '@/actions/utils';
import { addRegisterNotification } from '@/actions/admin';
import { toast } from 'react-toastify';

export default function RoleSelector({ userRoles, user }) {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [activeTab, setActiveTab] = useState('jumuiya');
  const [expandedAccordions, setExpandedAccordions] = useState({});

  // Toggle a role or role-position selection.
  const handleRoleChange = (role) => {
    setSelectedRoles((prevSelected) =>
      prevSelected.includes(role)
        ? prevSelected.filter((r) => r !== role)
        : [...prevSelected, role]
    );
  };

  // Toggle accordion expansion
  const toggleAccordion = (roleKey) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [roleKey]: !prev[roleKey]
    }));
  };

  // When the form is submitted, loop through all selected roles and send notifications.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Process each selected role.
      for (const role of selectedRoles) {
        await addRegisterNotification({
          selectedRole: role,
          userId: user._id,
          type: 'kujiungaKikundi',
          name: user.name,
        });
      }
      toast.success('Maombi ya kujiunga yamefanikiwa kutumwa.');
      // Optionally, clear the selections after successful submission:
      // setSelectedRoles([]);
    } catch (err) {
      toast.error('Imeshindikana kutuma maombi ya kujiunga.');
    }
  };

  // Group roles by prefix for organizing into tabs.
  const groupRoles = (prefix) => {
    return userRoles.filter(
      (roleObj) =>
        roleObj.role.startsWith(prefix) ||
        roleObj.role.startsWith(`kiongozi_${prefix}`)
    );
  };

  const jumuiyaGroup = groupRoles('jumuiya');
  const kwayaGroup = groupRoles('kwaya');
  const otherGroup = userRoles.filter(
    (roleObj) =>
      !roleObj.role.startsWith('jumuiya') &&
      !roleObj.role.startsWith('kiongozi_jumuiya') &&
      !roleObj.role.startsWith('kwaya') &&
      !roleObj.role.startsWith('kiongozi_kwaya')
  );

  // Custom Checkbox Component
  const CustomCheckbox = ({ id, label, checked, onChange }) => (
    <div className="flex items-center space-x-3 p-2 hover:bg-background-100 rounded-lg transition-colors duration-200">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          onClick={onChange}
          className={`w-5 h-5 border-2 rounded cursor-pointer transition-all duration-200 ${
            checked
              ? 'bg-primary-500 border-primary-500'
              : 'border-border-default hover:border-primary-400'
          }`}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-white absolute top-0.5 left-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      <label
        htmlFor={id}
        className="text-text-primary cursor-pointer select-none flex-1"
      >
        {label}
      </label>
    </div>
  );

  // Custom Accordion Component
  const CustomAccordion = ({ role, defaultPositions, isExpanded, onToggle }) => (
    <div className="border border-border-light rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 text-left bg-background-100 hover:bg-background-200 transition-colors duration-200 flex items-center justify-between"
      >
        <span className="font-medium text-text-primary">{formatRoleName(role)}</span>
        <svg
          className={`w-5 h-5 text-text-secondary transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isExpanded && (
        <div className="p-4 bg-white space-y-2 animate-slide-down">
          {defaultPositions.length > 0 ? (
            defaultPositions.map((position) => (
              <CustomCheckbox
                key={position}
                id={`${role}-${position}`}
                label={position}
                checked={selectedRoles.includes(`${role}-${position}`)}
                onChange={() => handleRoleChange(`${role}-${position}`)}
              />
            ))
          ) : (
            <CustomCheckbox
              id={role}
              label={formatRoleName(role)}
              checked={selectedRoles.includes(role)}
              onChange={() => handleRoleChange(role)}
            />
          )}
        </div>
      )}
    </div>
  );

  // Render the roles for a given group.
  const renderRoleRows = (groupRoles) => {
    return groupRoles.map((roleObj) => {
      const { role, defaultPositions } = roleObj;
      const isKiongozi = role.startsWith('kiongozi');
      
      return (
        <div key={role} className="mb-4">
          {isKiongozi ? (
            <CustomAccordion
              role={role}
              defaultPositions={defaultPositions}
              isExpanded={expandedAccordions[role]}
              onToggle={() => toggleAccordion(role)}
            />
          ) : (
            <div className="p-2">
              <CustomCheckbox
                id={role}
                label={formatRoleName(role)}
                checked={selectedRoles.includes(role)}
                onChange={() => handleRoleChange(role)}
              />
            </div>
          )}
        </div>
      );
    });
  };

  const tabs = [
    { key: 'jumuiya', label: 'Jumuiya', roles: jumuiyaGroup },
    { key: 'kwaya', label: 'Kwaya', roles: kwayaGroup },
    { key: 'others', label: 'Mengine', roles: otherGroup }
  ];

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <h3 className="text-xl font-semibold text-text-primary mb-6">Jiunge na Vikundi Vingine</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Custom Tabs */}
        <div className="mb-6">
          {/* Tab Headers */}
          <div className="flex space-x-1 bg-background-200 p-1 rounded-lg mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-48">
            {tabs.map((tab) => (
              <div
                key={tab.key}
                className={`space-y-3 ${
                  activeTab === tab.key ? 'block animate-fade-in' : 'hidden'
                }`}
              >
                {tab.roles.length > 0 ? (
                  renderRoleRows(tab.roles)
                ) : (
                  <div className="text-center py-8 text-text-tertiary">
                    <svg className="w-16 h-16 mx-auto mb-4 text-text-muted" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <p>Hakuna vikundi vilivyopatikana katika sehemu hii</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Roles Summary */}
        {selectedRoles.length > 0 && (
          <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg animate-fade-in">
            <h5 className="text-lg font-semibold text-primary-800 mb-3">Umechagua:</h5>
            <ul className="space-y-2 mb-4">
              {selectedRoles.map((role) => (
                <li key={role} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-primary-700">{formatRoleName(role)}</span>
                </li>
              ))}
            </ul>
            <button
              type="submit"
              className="btn-primary px-6 py-3 rounded-lg font-semibold text-white hover:scale-105 transition-all duration-300 shadow-primary"
            >
              Tuma Maombi
            </button>
          </div>
        )}
      </form>
    </div>
  );
}