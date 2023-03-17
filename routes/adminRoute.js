const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const authMiddleware = require("../middleware/authMiddleware");

// Admin router
// Router to get all Doctors
router.get("/get-all-doctors", authMiddleware , async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        res.status(200).send({ message: "Doctor fetched Successfully", success: true, data: doctors });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error fetching Doctors list", success: false, error });
    }
})

// Route to get all Users
router.get("/get-all-users", authMiddleware , async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send({ message: "User fetched Successfully", success: true, data: users });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error fetching Users list", success: false, error });
    }
})

// Route to Approve Status for Doctor Apply
router.post("/change-doctor-status", authMiddleware , async (req, res) => {
    try {
        const {doctorId, status} = req.body;
        const doctor = await Doctor.findByIdAndUpdate(doctorId, {
            status,
        });
        // find first the user
        const user = await User.findOne({_id: doctor.userId});
        // send the notifications to the user
        const unseenNotifications = user.unseenNotifications;
        unseenNotifications.push({
            type: "new-doctor-request-changed",
            message: `Your doctor account has been ${status}`,
            onClickPath: "/notifications"
            });
            user.isDoctor = status === "approved" ? true : false
        await user.save()

        res.status(200).send({
            message: "Doctor status updated successfully",
            success: true,
            data: doctor
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error changing Doctor status", success: false, error });
    }
})

module.exports = router;