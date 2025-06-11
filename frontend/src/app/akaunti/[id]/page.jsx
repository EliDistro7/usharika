'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import Dashboard from "../../../components/dashboard/Dashboard";
import { getDesanitezedCookie } from "../../../hooks/useUser";

const server = process.env.NEXT_PUBLIC_SERVER;

export default function Home() {
  const router= useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const name = getDesanitezedCookie(); // Ensure the user ID is retrieved from cookies
        console.log('name', name);
        const response = await axios.get(`${server}/${name}`); // Adjust endpoint as needed
        const userData = response.data;
              
        // Transform user data if necessary
        setUser(userData);
      } catch (err) {
        router.push('/auth')
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  // Example contributions (use dynamic data if available)
  const contributions = [
    { title: "Ahadi", iliyolipwa: user?.pledges.paidAhadi , Jumla: user?.pledges.ahadi },
    { title: "Jengo", iliyolipwa: user?.pledges.paidJengo, Jumla: user?.pledges.jengo },
  ];

  // Example summary (use dynamic calculations if available)
  const summary = {
    ahadi: user?.pledges.ahadi ,
    jengo: user?.pledges.jengo ,
    totalPaid: contributions.reduce((sum, c) => sum + c.iliyolipwa, 0),
    remainingBalance:
      contributions.reduce((sum, c) => sum + c.Jumla, 0) -
      contributions.reduce((sum, c) => sum + c.iliyolipwa, 0),
    deadline: "December 31, 2024", // Update dynamically if applicable
  };

  return (
    <div className="p-0" style={{backgroundColor: '#f3e8ff'}}>
      <Dashboard user={user} contributions={contributions} summary={summary} />
    </div>
  );
}