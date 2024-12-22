
const Attendance = require('../models/yombo/AttendanceSchema'); // Import the Attendance model

// Create Attendance Controller
const createAttendance = async (req, res) => {
  try {
    console.log('req body', req.body);
    const { group, date, session_name, attendees } = req.body;

    // Validate required fields
    if (!group || !session_name || !attendees || !Array.isArray(attendees)) {
      return res.status(400).json({
        message: 'Group, session name, and attendees array are required.',
      });
    }

    // Create a new attendance record
    const attendance = new Attendance({
      group,
      date: date || new Date(), // Default to current date if not provided
      session_name,
      attendees,
    });

    // Save to database
    const savedAttendance = await attendance.save();

    // Fetch all previous session names for the same group
    const sessions = await Attendance.find({ group }).select('session_name -_id');
    const sessionNames = sessions.map((session) => session.session_name);

    // Return success response with saved attendance and previous session names
    return res.status(201).json({
      message: 'Attendance created successfully',
      data: savedAttendance,
      previousSessions: sessionNames,
    });
  } catch (error) {
    console.error('Error creating attendance:', error);
    return res.status(500).json({
      message: 'Server error while creating attendance',
      error: error.message,
    });
  }
};



// Get Sessions by Group Controller
const getSessionsByGroup = async (req, res) => {
    try {
      console.log('Received request to get sessions by group');
  
      // Extract the group from the request parameters or query
      const { group } = req.params;
      console.log('Group parameter extracted from query:', group);
  
      // Validate the group parameter
      if (!group) {
        console.log('Error: Group parameter is missing');
        return res.status(400).json({
          message: 'Group is required.',
        });
      }
  
      // Query the database for sessions associated with the group
      console.log(`Querying database for sessions with group: ${group}`);
      const sessions = await Attendance.find({ group }).select('session_name -_id');
      console.log(`Found sessions for group ${group}:`, sessions);
  
      // Extract the session names from the results
      const sessionNames = sessions.map((session) => session.session_name);
      console.log('Extracted session names:', sessionNames);
  
      // Return the list of session names
      console.log(`Returning ${sessionNames.length} session(s) for group ${group}`);
      return res.status(200).json({
        message: `Sessions for group "${group}" retrieved successfully.`,
        data: sessionNames,
      });
    } catch (error) {
      console.error('Error retrieving sessions by group:', error);
      return res.status(500).json({
        message: 'Server error while retrieving sessions by group',
        error: error.message,
      });
    }
  };

// Get Attendance Records by Group Controller
// Get Attendance Records by Group Controller
const getAttendanceByGroup = async (req, res) => {
    try {
      console.log('Received request to get attendance records by group');
  
      // Extract the group parameter from the query string
      const { group } = req.params;
      console.log('Group parameter extracted from query:', group);
  
      // Validate the group parameter
      if (!group) {
        console.log('Error: Group parameter is missing');
        return res.status(400).json({
          message: 'Group is required.',
        });
      }
  
      // Fetch up to 7 attendance records for the specified group, sorted by date
      console.log(`Querying database for attendance records with group: ${group}`);
      const attendances = await Attendance.find({ group })
        .sort({ date: -1 }) // Sort by date, descending
        .limit(7) // Limit to 7 records
        .select('session_name date attendees -_id'); // Select specific fields to return
  
      console.log(`Found ${attendances.length} attendance records for group ${group}:`, attendances);
  
      // Return the attendance records
      console.log(`Returning ${attendances.length} attendance records for group ${group}`);
      return res.status(200).json({
        message: `Attendance records for group "${group}" retrieved successfully.`,
        data: attendances,
      });
    } catch (error) {
      console.error('Error retrieving attendance records:', error);
      return res.status(500).json({
        message: 'Server error while retrieving attendance records.',
        error: error.message,
      });
    }
  };

module.exports = { createAttendance, getSessionsByGroup,getAttendanceByGroup }
