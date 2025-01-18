
'use client';


import TopRankingUsers from "@/components/admins/TopRankingUsers";

import Sidebar from "@/components/admins/Sidebar";
import Cookie from "js-cookie";

export default function Ranks() {

    
  const group = Cookie.get("role") || "Unknown Group"; // Assumes the role is stored in a cookie
  console.log('goup', group)
   
  return (
    <div>
      
      <Sidebar>
      <TopRankingUsers group={Cookie.get("role")} />
      </Sidebar>
      
    
    </div>
  );
}
