



const express = require('express');
const router = express.Router();
const {
    createAttendance,getAttendanceByGroup,getSessionsByGroup
} = require('../controllers/attendance-controller.js');

router.post('/createAttendance', createAttendance);
router.get('/getAttendanceByGroup/:group', getAttendanceByGroup);
router.get('/getSessionsByGroup/:group', getSessionsByGroup)

module.exports = router;
