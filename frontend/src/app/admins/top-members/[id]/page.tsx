
'use client';


import TopRankingUsers from "@/components/admins/TopRankingUsers";

import Cookie from "js-cookie";
import CustomNavbar from "@/components/admins/CustomNavbar";

export default function Ranks() {

    
  const group = Cookie.get("role") || "Unknown Group"; // Assumes the role is stored in a cookie
  console.log('goup', group)
   
  return (
    <div>
      

      <TopRankingUsers group={Cookie.get("role")} />
      <CustomNavbar />
      
    
    </div>
  );
}
