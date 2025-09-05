import React, { useState } from "react";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import Highlights from "../Highlights";
import CustomModal from "./Modal";

const HighlightsTable = ({ highlights = [], onEdit, onDelete, onAddContent }) => {
  const [previewHighlight, setPreviewHighlight] = useState(null);

  const handleClosePreview = () => setPreviewHighlight(null);

  return (
    <div className="mb-8">
      {/* Table Container with custom styling */}
      <div className="overflow-hidden rounded-2xl border border-border-default shadow-medium bg-background-50">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-primary-gradient">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">#</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Jina</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Idadi ya maudhui</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Muda ilipoundwa</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody>
            {highlights.length > 0 ? (
              highlights.map((highlight, index) => (
                <tr
                  key={highlight._id}
                  className={`
                    border-b border-border-light transition-colors duration-200 hover:bg-background-200
                    ${index % 2 === 0 ? 'bg-background-50' : 'bg-background-100'}
                  `}
                >
                  <td className="px-6 py-4 text-text-primary font-medium">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-text-primary font-medium">
                    {highlight.name}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {highlight.content.length}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-secondary text-sm">
                    {new Date(highlight.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(highlight)}
                        className="inline-flex items-center px-3 py-2 rounded-lg bg-yellow-500 text-white text-xs font-semibold hover:bg-yellow-600 transition-all duration-200 hover:scale-105 shadow-yellow"
                      >
                        <FaEdit className="mr-1.5" />
                        Edit
                      </button>
                      
                      {/* Preview Button */}
                      <button
                        onClick={() => setPreviewHighlight(highlight)}
                        className="inline-flex items-center px-3 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition-all duration-200 hover:scale-105 shadow-primary"
                      >
                        <FaEye className="mr-1.5" />
                        Preview
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => onDelete(highlight._id)}
                        className="inline-flex items-center px-3 py-2 rounded-lg bg-error-500 text-white text-xs font-semibold hover:bg-error-600 transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        <FaTrash className="mr-1.5" />
                        Futa
                      </button>
                      
                      {/* Add Content Button */}
                      <button
                        onClick={() => onAddContent(highlight)}
                        className="inline-flex items-center px-3 py-2 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-all duration-200 hover:scale-105 shadow-green"
                      >
                        <FaPlus className="mr-1.5" />
                        Ongeza maudhui
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-background-300 rounded-full flex items-center justify-center">
                      <FaEye className="text-2xl text-text-tertiary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-text-primary mb-1">
                        No recent highlights found
                      </h3>
                      <p className="text-text-secondary">
                        Create your first highlight to get started
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Preview Modal */}
      <CustomModal show={!!previewHighlight} onClose={handleClosePreview}>
        <Highlights data={previewHighlight} />
      </CustomModal>
    </div>
  );
};

export default HighlightsTable;