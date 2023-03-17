const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const Doctor = require("../models/doctorModel");

// Route to render the layout of a Doctor Profile with the original information
router.post("/get-doctor-info-by-user-id", authMiddleware,  async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId });
        res.status(200)
            .send({ 
                success: true, 
                message: "Doctor info fetched successfully", 
                data: doctor });
    } catch (error) {
        console. log(error);
        res
            .status(500)
            .send({ message: "Error getting Doctor info", success: false, error });
    }
})

// Route to get updates in the Doctor Profile
router.post("/update-doctor-profile", authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndUpdate({ userId: req.body.userId }, req.body);
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

module.exports = router;