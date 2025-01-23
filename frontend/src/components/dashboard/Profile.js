import { getLoggedInUserId } from "@/hooks/useUser";
import Link from "next/link";


const Profile = ({ user }) => {
  console.log('user', user);
    return (
      <div className="text-left mb-4 w-100">
        <Link href={`/profile/${getLoggedInUserId()}`}>
        
        <img
          src={user?.profilePicture || "https://via.placeholder.com/100"}
          alt="Profile"
          className="rounded-circle mb-3"
          style={{ width: "100px", height: "100px" }}
        />
        <h5 className="card-title font-bold text-sm md:text-lg">{user?.name || "N/A"}</h5>
        
        </Link>
        
      </div>
    );
  };
  
  export default Profile;
  