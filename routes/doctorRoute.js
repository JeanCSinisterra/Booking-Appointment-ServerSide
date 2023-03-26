const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");


// Route to render the layout of a Doctor Profile with the original information
router.post("/get-doctor-info-by-user-id", authMiddleware,  async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ _id: req.body.userId});
        res.status(200)
            .send({ 
                success: true, 
                message: "Doctor info fetched successfully", 
                data: doctor });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send({ message: "Error getting Doctor info", success: false, error });
    }
})

// Route to get updates in the Doctor Profile
router.post("/update-doctor-profile", authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndUpdate({ _id: req.body.userId }, req.body);
        res.status(200)
            .send({
                success: true,
                message: "Doctor profile updated successfully",
                data: doctor
            });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send({ message: "Error: Something went wrong. Please try again later.", success: false, error });
    }
})

// Route to render the layout of a Doctor into the Homepage
router.post("/get-doctor-info-by-id", authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ _id: req.body.doctorId });    
        res.status(200)
            .send({
                success: true,
                message: "Doctor info fetched successfully",
                data: doctor
            });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send({ message: "Error getting Doctor info", success: false, error });
    }
})

// Route to render the layout of the Appointments
router.get("/get-appointments-by-doctor-id", authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId });
        const appointments = await Appointment.find({ doctorId: doctor._id})
        res.status(200)
            .send({
                success: true,
                message: "Appointments fetched successfully",
                data: appointments,
            });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error fetching Appointments", success: false, error });
    }
})

// Route to Approve Status for Doctor Apply
router.post("/change-appointment-status", authMiddleware, async (req, res) => {
    try {
        const { appointmentId, status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
            status,
        });
        // find first the user
        const user = await User.findOne({ _id: appointment.userId });
        // send the notifications to the user
        const unseenNotifications = user.unseenNotifications;
        unseenNotifications.push({
            type: "appointment-status-changed",
            message: `Your appointment account has been ${status}`,
            onClickPath: "/appointments"
        });
        await user.save()

        res.status(200).send({
            message: "Appointment status updated successfully",
            success: true,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error changing Appointment status", success: false, error });
    }
})

module.exports = router;