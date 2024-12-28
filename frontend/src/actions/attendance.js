

import axios from 'axios';

const api = process.env.NEXT_PUBLIC_SERVER;

/**
 * Function to create attendance
 * @param {Object} attendanceData - Attendance data to send to the server
 * @param {string} attendanceData.group - Group name (e.g., vijana_kwaya)
 * @param {string} attendanceData.date - Date of the attendance (ISO string or date format)
 * @param {string} attendanceData.session_name - Name of the session
 * @param {Array} attendanceData.attendees - Array of attendee objects (e.g., [{ name: 'John', userId: '123' }])
 */
export const createAttendance = async (attendanceData) => {
  try {
    console.log('attendance', attendanceData);
    // Define the API endpoint
    const apiUrl = `${api}/createAttendance`; // Update with your actual backend URL

    // Send the POST request to the server
    const response = await axios.post(apiUrl, attendanceData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Log the success response
    console.log('Attendance created successfully:', response.data);

    // Return success message or data
    return response.data;
  } catch (error) {
    // Log and handle errors
    console.error('Error creating attendance:', error.response?.data || error.message);
    throw error; // Rethrow the error for higher-level handling if needed
  }
};


/**
 * Function to get attendance records by group
 * @param {string} group - The group name to fetch attendance records for
 * @returns {Promise<Object[]>} - An array of attendance records
 */
export const getAttendanceByGroup = async (group) => {
    try {
      console.log(`Fetching attendance records for group: ${group}`);
      
      // Define the API endpoint
      const apiUrl = `${api}/getAttendanceByGroup/${group}`; // Adjust URL to match your backend route
      console.log(`API URL: ${apiUrl}`);
  
      // Send the GET request to the server
      const response = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Log the success response
      console.log(`Attendance records for group ${group} retrieved:`, response.data);
  
      // Return attendance data
      return response.data.data; // Assuming the data is returned in `data` property
    } catch (error) {
      // Log and handle errors
      console.error(`Error fetching attendance records for group ${group}:`, error.response?.data || error.message);
      throw error; // Rethrow the error for higher-level handling if needed
    }
  };
  


  /**
 * Function to fetch session names for a specific group
 * @param {string} group - The group name to fetch session names for
 * @returns {Promise<{success: boolean, data?: string[], message?: string}>} - Result object containing session names or an error message
 */
export const fetchSessionsByGroup = async (group) => {
    try {
      // Validate the input group
      if (!group) {
        throw new Error('Group parameter is required.');
      }
  
      // Define the API endpoint
      const apiUrl = `${api}/getSessionsByGroup/${group}`; // Adjust URL to match your backend route
  
      // Send the GET request to the server
      const response = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Log the success response
      console.log(`Sessions for group ${group} retrieved successfully:`, response.data);
  
      return {
        success: true,
        data: response.data.data, // Array of session names
        message: response.data.message,
      };
    } catch (error) {
      console.error(`Error fetching sessions for group ${group}:`, error.response?.data || error.message);
  
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Server error.',
      };
    }
  };

  /**
 * Function to get an attendance record by ID
 * @param {string} attendanceId - The ID of the attendance record to fetch
 * @returns {Promise<Object>} - The attendance record object
 */
export const getAttendanceById = async (attendanceId) => {
  try {
    console.log(`Fetching attendance record for ID: ${attendanceId}`);
    
    // Validate the input attendanceId
    if (!attendanceId) {
      throw new Error('Attendance ID parameter is required.');
    }

    // Define the API endpoint
    const apiUrl = `${api}/getAttendanceById/${attendanceId}`; // Adjust URL to match your backend route
    console.log(`API URL: ${apiUrl}`);

    // Send the GET request to the server
    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Log the success response
    console.log(`Attendance record for ID ${attendanceId} retrieved successfully:`, response.data);

    // Return attendance record
    return response.data.data; // Assuming the attendance record is returned in `data` property
  } catch (error) {
    // Log and handle errors
    console.error(`Error fetching attendance record for ID ${attendanceId}:`, error.response?.data || error.message);
    throw error; // Rethrow the error for higher-level handling if needed
  }
};
