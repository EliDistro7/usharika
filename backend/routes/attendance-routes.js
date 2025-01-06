



const express = require('express');
const router = express.Router();
const {
    createAttendance,getAttendanceByGroup,getSessionsByGroup,getAttendanceById,
    archiveSession,
    unarchiveSession,
    getTopRankingUsersByGroup,
} = require('../controllers/attendance-controller.js');

router.post('/createAttendance', createAttendance);
router.get('/getAttendanceByGroup/:group', getAttendanceByGroup); 
router.get('/getAttendanceById/:attendanceId', getAttendanceById);
router.get('/getSessionsByGroup/:group', getSessionsByGroup)

// New archive/unarchive routes
router.patch('/attendance/:id/archive', archiveSession);
router.patch('/attendance/:id/unarchive', unarchiveSession);

// New route for top-ranking users
router.post('/attendance/top-ranking-users', getTopRankingUsersByGroup);

module.exports = router;
