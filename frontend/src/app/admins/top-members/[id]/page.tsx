
'use client';

import CustomNavbar from "@/components/admins/CustomNavbar";
import TopRankingUsers from "@/components/admins/TopRankingUsers";
import Cookie from "js-cookie";

export default function Ranks() {

    
  const group = Cookie.get("role") || "Unknown Group"; // Assumes the role is stored in a cookie
  console.log('goup', group)
   
  return (
    <div>
      <CustomNavbar />
      
    <TopRankingUsers group={Cookie.get("role")} />
    </div>
  );
}
