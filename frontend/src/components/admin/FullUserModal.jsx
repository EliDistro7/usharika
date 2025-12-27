import { verifyUser } from "@/actions/admin";
import { formatRoleName } from "@/actions/utils";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { User, Phone, Users, Calendar, Briefcase, Award, Gift, Heart, X } from "lucide-react";

const FullUserModal = ({ user, onClose, notification }) => {
  if (!user) return null;

  const handleVerification = async () => {
    try {
      if (notification.type === "registeringNotification") {
        await verifyUser({ userId: notification.userId });
        toast.success(`Ndugu ${notification.name} amethibitishwa kuwa Msharika wa Usharika wa Yombo`);
        return;
      }
      if (notification.type === "kujiungaKikundi") {
        toast.success(`Ndugu ${notification.name} amethibitishwa kujiunga na ${notification.selectedRole}`);
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100/10 to-lavender-200/20 backdrop-blur-md z-50 animate-fade-in"
    >
      <ToastContainer 
        autoClose={4000}
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div
        className="bg-gradient-to-br from-white to-background-100 rounded-3xl max-w-3xl w-[95%] max-h-[95vh] shadow-primary-lg border border-primary-100 overflow-hidden animate-slide-up"
      >
        {/* Header with gradient */}
        <div className="bg-primary-gradient px-8 py-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex justify-between items-center relative">
            <div>
              <h4 className="text-2xl font-bold mb-2">
                {notification.type === "registeringNotification"
                  ? "Maombi ya Usajili"
                  : "Kujiunga na Kikundi"}
              </h4>
              {notification.type !== "registeringNotification" && (
                <p className="mb-0 opacity-75 text-sm">
                  {formatRoleName(notification.selectedRole)}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 border-none rounded-full w-10 h-10 flex items-center justify-center text-2xl cursor-pointer text-white transition-all duration-300 hover:scale-110"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-auto max-h-[calc(95vh-180px)] px-8 py-8">
          
          {/* User Profile Card */}
          <div className="mb-6 bg-gradient-to-br from-white to-primary-50 rounded-2xl p-6 border border-primary-100 shadow-soft">
            <div className="flex items-center">
              <div className="relative mr-6">
                <img
                  src={user.profilePicture || "/img/default-profile.png"}
                  alt={`${user.name}'s profile`}
                  className="w-28 h-28 rounded-full object-cover border-4 border-primary-500 shadow-primary"
                />
                <div className={`absolute bottom-2 right-0 w-6 h-6 rounded-full border-3 border-white ${user.verified ? 'bg-success-500' : 'bg-warning-500'}`}></div>
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-primary-700 mb-3">
                  {user.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center mb-2">
                      <Phone size={18} className="text-primary-500 mr-2" />
                      <span className="text-text-secondary">{user.phone}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Users size={18} className="text-primary-500 mr-2" />
                      <span className="text-text-secondary">{user.jumuiya}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <User size={18} className="text-primary-500 mr-2" />
                      <span className="text-text-secondary">
                        {user.gender === "me" ? "Mwanaume" : "Mwanamke"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={18} className="text-primary-500 mr-2" />
                      <span className="text-text-secondary">
                        {new Date().getFullYear() - new Date(user.dob).getFullYear()} miaka
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Details Card */}
          <div className="mb-6 bg-gradient-to-br from-white to-peaceful-50 rounded-2xl p-6 border border-primary-100">
            <div className="flex items-center mb-4">
              <User size={20} className="text-primary-600 mr-2" />
              <h5 className="text-lg font-semibold text-primary-700 m-0">
                Taarifa binafsi
              </h5>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-3">
                  <small className="text-text-tertiary font-medium block mb-1">Hali ya Ndoa</small>
                  <p className="text-text-primary font-medium mb-0">
                    {user.maritalStatus} ({user.marriageType})
                  </p>
                </div>
                <div className="mb-3">
                  <small className="text-text-tertiary font-medium block mb-1">Ubatizo</small>
                  <p className="mb-0">
                    <span className={`inline-block px-3 py-1 rounded-xl text-xs font-semibold ${user.ubatizo ? 'bg-success-500 text-white' : 'bg-warning-500 text-white'}`}>
                      {user.ubatizo ? "Ndiyo" : "Hapana"}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <small className="text-text-tertiary font-medium block mb-1">Kipaimara</small>
                  <p className="mb-0">
                    <span className={`inline-block px-3 py-1 rounded-xl text-xs font-semibold ${user.kipaimara ? 'bg-success-500 text-white' : 'bg-warning-500 text-white'}`}>
                      {user.kipaimara ? "Ndiyo" : "Hapana"}
                    </span>
                  </p>
                </div>
                <div className="mb-3">
                  <small className="text-text-tertiary font-medium block mb-1">Kazi</small>
                  <div className="flex items-center">
                    <Briefcase size={16} className="text-primary-500 mr-2" />
                    <span className="text-text-primary font-medium">{user.occupation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Roles Card */}
          <div className="mb-6 bg-gradient-to-br from-white to-lavender-50 rounded-2xl p-6 border border-primary-100">
            <div className="flex items-center mb-4">
              <Award size={20} className="text-primary-600 mr-2" />
              <h5 className="text-lg font-semibold text-primary-700 m-0">
                Nafasi na Vikundi alivyomo
              </h5>
            </div>
            {user.selectedRoles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.selectedRoles.map((role, index) => (
                  <span
                    key={index}
                    className="bg-primary-gradient text-white px-4 py-2 rounded-2xl text-sm font-medium"
                  >
                    {role.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-text-tertiary italic m-0">
                Hakuna majukumu yaliyotolewa.
              </p>
            )}
          </div>

          {/* Pledges Card */}
          <div className="mb-6 bg-gradient-to-br from-white to-success-50 rounded-2xl p-6 border border-primary-100">
            <div className="flex items-center mb-4">
              <Gift size={20} className="text-primary-600 mr-2" />
              <h5 className="text-lg font-semibold text-primary-700 m-0">
                Ahadi za Msharika
              </h5>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                <h6 className="text-primary-700 font-semibold mb-2">Ahadi</h6>
                <p className="text-text-primary font-bold text-lg mb-1">
                  {user.pledges.ahadi.toLocaleString()} TZS
                </p>
                <small className="text-success-600 font-medium">
                  Iliyolipwa: {user.pledges.paidAhadi.toLocaleString()} TZS
                </small>
              </div>
              <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                <h6 className="text-primary-700 font-semibold mb-2">Jengo</h6>
                <p className="text-text-primary font-bold text-lg mb-1">
                  {user.pledges.jengo.toLocaleString()} TZS
                </p>
                <small className="text-success-600 font-medium">
                  Iliyolipwa: {user.pledges.paidJengo.toLocaleString()} TZS
                </small>
              </div>
            </div>
            
            {/* Dynamic pledges */}
            {user.pledges.other && Object.keys(user.pledges.other).length > 0 && (
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(user.pledges.other).map(([key, { total, paid }]) => (
                    <div key={key} className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                      <h6 className="text-primary-700 font-semibold mb-2">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </h6>
                      <p className="text-text-primary font-bold text-lg mb-1">
                        {total.toLocaleString()} TZS
                      </p>
                      <small className="text-success-600 font-medium">
                        Iliyolipwa: {paid.toLocaleString()} TZS
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dependents Card */}
          <div className="bg-gradient-to-br from-white to-rose-50 rounded-2xl p-6 border border-primary-100">
            <div className="flex items-center mb-4">
              <Heart size={20} className="text-primary-600 mr-2" />
              <h5 className="text-lg font-semibold text-primary-700 m-0">
                Wategemezi
              </h5>
            </div>
            {user.dependents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {user.dependents.map((dependent, index) => (
                  <div key={index} className="bg-primary-50 rounded-xl px-4 py-3 border border-primary-100">
                    <p className="text-text-primary font-medium mb-0">
                      {dependent.name}
                    </p>
                    <small className="text-text-tertiary">({dependent.relation})</small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-tertiary italic m-0">
                Hakuna wategemezi waliosajiliwa.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-br from-background-200 to-primary-50 px-8 py-5 border-t border-primary-100 flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="bg-transparent border-2 border-primary-500 text-primary-700 px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-primary-500 hover:text-white"
          >
            Funga
          </button>
          <button
            type="button"
            onClick={handleVerification}
            className="bg-primary-gradient border-none text-white px-8 py-3 rounded-xl text-sm font-semibold cursor-pointer shadow-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary-lg"
          >
            Thibitisha
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.4s ease-out;
        }

        .overflow-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-auto::-webkit-scrollbar-track {
          background: rgba(168, 85, 247, 0.1);
          border-radius: 3px;
        }

        .overflow-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #A855F7 0%, #9333EA 100%);
          border-radius: 3px;
        }

        .overflow-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #9333EA 0%, #7E22CE 100%);
        }
      `}</style>
    </div>
  );
};

export default FullUserModal;