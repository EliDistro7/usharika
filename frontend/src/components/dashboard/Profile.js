import { getLoggedInUserId } from "@/hooks/useUser";
import Link from "next/link";
import { User, Church, Edit, Crown } from "lucide-react";
import { CheckCircle } from "lucide-react";

const Profile = ({ user }) => {
  // Get user initials for fallback avatar
  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Determine if user has leadership role
  const isLeader = user?.roles?.some(role => role.includes('kiongozi')) || false;
  
  return (
    <div className="transition-all duration-300 relative overflow-hidden hover:-translate-y-1">
      <Link 
        href={`/profile/${getLoggedInUserId()}`}
        className="text-decoration-none block"
      >
        <div className="bg-white/90 glass border border-border-light rounded-3xl p-4 shadow-soft hover:shadow-medium transition-all duration-300">
          
          {/* Mobile Layout */}
          <div className="flex md:hidden items-center">
            <div className="relative flex-shrink-0 group">
             
              {/* Fallback Avatar with Initials */}
              <div 
                className={`w-15 h-15 bg-primary-gradient rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-primary-200 shadow-primary transition-all duration-300 group-hover:border-primary-500 group-hover:scale-105 ${user?.profilePicture ? 'hidden' : 'flex'}`}
              >
                {getInitials(user?.name)}
              </div>

              {/* Online Status Indicator */}
              <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-success-500 rounded-full border-2 border-white animate-pulse-soft"></div>

              {/* Edit Overlay */}
              <div className="absolute inset-0 bg-primary-600/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Edit className="text-white" size={16} />
              </div>
            </div>

            <div className="flex-grow ml-4">
              <div className="flex items-center mb-1">
                <h6 className="text-lg font-display font-bold bg-primary-gradient bg-clip-text text-transparent mb-0 mr-2">
                  {user?.name || "Church Member"}
                </h6>
                
                {/* Leadership Badge */}
                {isLeader && (
                  <Crown className="text-yellow-500 drop-shadow-lg" size={16} title="Church Leader" />
                )}
                
                {/* Verified Badge */}
                <CheckCircle className="text-success-500 ml-1" size={16} title="Verified Member" />
              </div>
              
              <div className="flex items-center">
                <Church className="text-primary-600 mr-1" size={12} />
                <small className="text-text-secondary font-medium">Active Member</small>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block text-center">
            <div className="relative inline-block mb-4 group">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={`${user?.name || 'User'} Profile`}
                  className="w-20 h-20 rounded-full object-cover border-3 border-primary-200 shadow-primary transition-all duration-300 group-hover:border-primary-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              
              {/* Fallback Avatar with Initials */}
              <div 
                className={`w-25 h-25 bg-primary-gradient rounded-full flex items-center justify-center text-white font-bold text-2xl border-3 border-primary-200 shadow-primary transition-all duration-300 group-hover:border-primary-500 group-hover:scale-105 ${user?.profilePicture ? 'hidden' : 'flex'}`}
              >
                {getInitials(user?.name)}
              </div>

              {/* Online Status Indicator */}
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-success-500 rounded-full border-2 border-white animate-pulse-soft"></div>

              {/* Leadership Crown */}
              {isLeader && (
                <div className="absolute -top-2 right-4">
                  <Crown className="text-yellow-500 drop-shadow-lg" size={20} title="Church Leader" />
                </div>
              )}

              {/* Edit Overlay */}
              <div className="absolute inset-0 bg-primary-600/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Edit className="text-white" size={20} />
              </div>
            </div>

            <div className="flex items-center justify-center mb-2">
              <h5 className="text-xl font-display font-bold bg-primary-gradient bg-clip-text text-transparent mb-0 mr-2">
                {user?.name || "Church Member"}
              </h5>
              <CheckCircle className="text-success-500" size={18} title="Verified Member" />
            </div>
            
            <div className="flex items-center justify-center mb-3">
              <Church className="text-primary-600 mr-2" size={14} />
              <small className="text-text-secondary font-medium">Active Church Member</small>
            </div>

            {/* Member Status Badge */}
            <div className="mt-3">
              <span className="inline-flex items-center bg-primary-gradient text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse-soft">
                <User className="mr-1" size={12} />
                Online
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Profile;