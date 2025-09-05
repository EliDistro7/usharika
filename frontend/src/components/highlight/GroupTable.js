import React from "react";
import { FaTrash, FaPlus, FaBook } from "react-icons/fa";

const GroupTable = ({ content, onAddContent, onRemoveGroup }) => (
  <div className="space-y-4">
    {content && content.length > 0 ? (
      <div className="overflow-hidden rounded-2xl border border-border-default shadow-medium bg-background-50">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-primary-gradient">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white w-16">#</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Chapter</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white w-80">Actions</th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody>
            {content.map((group, groupIndex) => (
              <tr
                key={groupIndex}
                className={`
                  border-b border-border-light transition-colors duration-200 hover:bg-background-200
                  ${groupIndex % 2 === 0 ? 'bg-background-50' : 'bg-background-100'}
                `}
              >
                <td className="px-6 py-4 text-text-primary font-medium">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 text-sm font-bold">
                    {groupIndex + 1}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FaBook className="text-primary-600" size={16} />
                    </div>
                    <span className="text-text-primary font-medium text-base">
                      {group.groupName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {/* Add Content Button */}
                    <button
                      onClick={() => onAddContent(groupIndex)}
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-all duration-200 hover:scale-105 shadow-primary"
                    >
                      <FaPlus className="mr-2" size={12} />
                      Ongeza Maudhui
                    </button>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveGroup(groupIndex)}
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-error-500 text-white text-sm font-semibold hover:bg-error-600 transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      <FaTrash className="mr-2" size={12} />
                      Ondoa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-12 px-6 bg-background-100 rounded-2xl border-2 border-dashed border-border-medium">
        <div className="w-16 h-16 bg-background-300 rounded-full flex items-center justify-center mb-4">
          <FaBook className="text-2xl text-text-tertiary" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Hakuna Chapter Yoyote
          </h3>
          <p className="text-text-secondary">
            Hakuna alabamu yoyote kwa sasa. Anza kuongeza chapters za kwanza.
          </p>
        </div>
      </div>
    )}
  </div>
);

export default GroupTable;