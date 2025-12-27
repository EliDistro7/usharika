import React from "react";
import { Crown, Phone, User, MapPin, Briefcase, TrendingUp, DollarSign, AlertCircle } from "lucide-react";

const UserTableRows = ({
  users,
  sortBy,
  calculatePledgeTotals,
  handleUserClick,
}) => {
  return (
    <>
      {users.map((user, index) => {
        const { totalPledged, totalPaid, totalRemaining } =
          sortBy !== "none" ? calculatePledgeTotals(user, sortBy) : {};
  
        const hasKiongoziRole = user.selectedRoles.some((role) =>
          role.startsWith("kiongozi")
        );

        // Calculate completion percentage for pledges
        const completionPercentage = sortBy !== "none" && totalPledged > 0 
          ? Math.round((totalPaid / totalPledged) * 100) 
          : 0;
  
        return (
          <tr
            key={user._id}
            onClick={() => handleUserClick(user)}
            className={`
              cursor-pointer transition-all duration-300 ease-in-out
              border-b border-border-light hover:bg-primary-50/50
              ${index % 2 === 0 
                ? 'bg-gradient-to-r from-white to-background-100' 
                : 'bg-gradient-to-r from-background-50 to-background-100'
              }
            `}
          >
            {/* Enhanced Profile Picture */}
            <td className="text-center py-4 px-3">
              <div className="relative inline-block">
                <img
                  src={user.profilePicture || "/img/default-profile.png"}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-3 border-primary-500 shadow-primary"
                />
                {/* Verification indicator */}
                {user.verified && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </td>
  
            {/* Enhanced User Name with Kiongozi Badge */}
            <td className="py-4 px-3">
              <div className="flex items-center">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="font-bold text-primary-700 text-base mr-2">
                      {user.name}
                    </span>
                    {hasKiongoziRole && (
                      <span className="inline-flex items-center bg-primary-gradient text-white text-xs font-medium px-2 py-1 rounded-xl shadow-primary">
                        <Crown size={12} className="mr-1" />
                        Kiongozi
                      </span>
                    )}
                  </div>
                  {/* Show phone on mobile as subtitle */}
                  <div className="md:hidden">
                    <div className="flex items-center text-text-tertiary text-xs">
                      <Phone size={12} className="mr-1" />
                      {user.phone}
                    </div>
                  </div>
                </div>
              </div>
            </td>
  
            {/* User Details */}
            {sortBy === "none" ? (
              <>
                {/* Enhanced Phone column - hidden on small screens */}
                <td className="hidden md:table-cell py-4 px-3">
                  <div className="flex items-center">
                    <Phone size={16} className="text-primary-500 mr-2" />
                    <span className="text-text-secondary font-medium">
                      {user.phone}
                    </span>
                  </div>
                </td>
  
                {/* Enhanced Gender column - hidden on extra small screens */}
                <td className="hidden sm:table-cell py-4 px-3">
                  <div className="flex items-center">
                    <User size={16} className="text-primary-500 mr-2" />
                    <span 
                      className={`
                        inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium
                        ${user.gender === "me" 
                          ? 'bg-peaceful-gradient text-peaceful-900'
                          : 'bg-gradient-to-r from-rose-400 to-rose-600 text-white'
                        }
                      `}
                    >
                      {user.gender === "me" ? "Mume" : "Mke"}
                    </span>
                  </div>
                </td>
  
                {/* Enhanced Jumuiya column - hidden on small screens */}
                <td className="hidden lg:table-cell py-4 px-3">
                  <div className="flex items-center">
                    <MapPin size={16} className="text-primary-500 mr-2 flex-shrink-0" />
                    <span
                      className="max-w-[180px] overflow-hidden whitespace-nowrap text-ellipsis text-primary-700 font-medium"
                      title={user.jumuiya}
                    >
                      {user.jumuiya}
                    </span>
                  </div>
                </td>
  
                {/* Enhanced Occupation column */}
                <td className="py-4 px-3">
                  <div className="flex items-center">
                    <Briefcase size={16} className="text-primary-500 mr-2 flex-shrink-0" />
                    <span 
                      className="text-text-secondary font-medium max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis"
                      title={user.occupation}
                    >
                      {user.occupation}
                    </span>
                  </div>
                </td>
              </>
            ) : (
              <>
                {/* Enhanced Pledge Totals */}
                <td className="py-4 px-3">
                  <div className="flex items-center">
                    <TrendingUp size={16} className="text-success-500 mr-2" />
                    <div>
                      <div className="text-success-600 font-bold text-lg">
                        {totalPledged?.toLocaleString() || '0'}
                      </div>
                      <small className="text-text-tertiary text-xs">
                        Ahadi
                      </small>
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-3">
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-peaceful-500 mr-2" />
                    <div>
                      <div className="text-peaceful-600 font-bold text-lg">
                        {totalPaid?.toLocaleString() || '0'}
                      </div>
                      <small className="text-text-tertiary text-xs">
                        Iliyolipwa
                      </small>
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle size={16} className="text-error-500 mr-2" />
                      <div>
                        <div className="text-error-600 font-bold text-lg">
                          {totalRemaining?.toLocaleString() || '0'}
                        </div>
                        <small className="text-text-tertiary text-xs">
                          Baki
                        </small>
                      </div>
                    </div>
                    
                    {/* Progress indicator */}
                    {sortBy !== "none" && totalPledged > 0 && (
                      <div className="ml-3">
                        <div className="w-15 h-2 bg-primary-100 rounded overflow-hidden">
                          <div
                            className={`
                              h-full rounded transition-all duration-300
                              ${completionPercentage >= 100 
                                ? 'bg-gradient-to-r from-success-500 to-success-600'
                                : completionPercentage >= 50
                                ? 'bg-gradient-to-r from-warning-500 to-warning-600'
                                : 'bg-gradient-to-r from-error-500 to-error-600'
                              }
                            `}
                            style={{ width: `${Math.min(completionPercentage, 100)}%` }}
                          />
                        </div>
                        <small className="block text-center text-text-tertiary text-[0.7rem] mt-0.5">
                          {completionPercentage}%
                        </small>
                      </div>
                    )}
                  </div>
                </td>
              </>
            )}
          </tr>
        );
      })}
    </>
  );
};

export default UserTableRows;