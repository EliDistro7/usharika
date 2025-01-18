
'use client'

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import UserTable from "@/components/admins/UserTable";
import { getUsersByRole } from "@/hooks/useUser";
import Sidebar from "@/components/admins/Sidebar";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Get the role from the cookie
        const role = Cookies.get("role");
        if (!role) {
          console.error("No role found in cookies!");
          setLoading(false);
          return;
        }

        // Fetch users by role
        const fetchedUsers = await getUsersByRole({role});
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching data
  }

  return (
    <>
    <Sidebar>

    <div className="px-0 mx-0 py-0 mt-0">
      
      <UserTable data={users} tableName={Cookies.get("role")?.replace('_', ' ')}/>
    </div>
    </Sidebar>
   
    </>
   
  );
}
