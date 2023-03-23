const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const Appointment = require("../models/appointmentModel");
const dayjs = require('dayjs');

// Register Route
router.post("/register", async (req, res) => {
  try {
    // Check first if the user exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    // Hashed Password
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newuser = new User(req.body);
    await newuser.save();
    res
      .status(200)
      .send({ message: "User created Successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .send({ message: "Login Successful", success: true, data: token });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error trying to logging user", success: false, error });
  }
});

// Middleware to protect Routes
router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: " User does not exist", success: false });
    } else {
      res.status(200).send({ success: true, data: user });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
});

// Apply Doctor Route
router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
  try {
    // Check if the time value is correctly received in the server-side code.
    const newdoctor = new Doctor({ ...req.body, status: "pending" });
    await newdoctor.save();
    const adminUser = await User.findOne( { isAdmin: true });
    // Push the notification from a new user that wants to Apply as a Doctor
    const unseenNotifications = adminUser.unseenNotifications;
    unseenNotifications.push({
      type: "new-doctor-request",
      message: `${newdoctor.firstName} ${newdoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newdoctor._id,
        name: newdoctor.firstName + " " + newdoctor.lastName,
      },
      onClickPath: "/admin/doctorslist"
    });
    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
    res.status(200).send({
      success: true,
      message: "Doctor account applied successfully"
    })
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: "Error trying to apply Doctor Account",
        success: false,
        error,
      });
  }
});

// Mark Notifications as read
router.post(
  "/mark-all-notifications-as-read",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      const unseenNotifications = user.unseenNotifications;
      const seenNotifications = user.seenNotifications;
      seenNotifications.push(...unseenNotifications);
      user.unseenNotifications = [];
      user.seenNotifications = seenNotifications;
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).send({
        success: true,
        message: "All notifications marked as read",
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({
          message: "Error to mark all notifications as read",
          success: false,
          error,
        });
    }
  }
);

// Delete all notifications
router.post("/delete-all-notifications", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.seenNotifications = [];
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications Deleted",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: "Error to delete all notifications",
        success: false,
        error,
      });
  }
});

// Get all Doctor to display in the HomePage
router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
    res
      .status(200)
      .send({
        message: "Doctor fetched Successfully",
        success: true,
        data: doctors,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error fetching Doctors list", success: false, error });
  }
});

// Route to Book the appointments
router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    // Convert date and time values to UTC moment objects
    const date = dayjs(req.body.date).format("DD-MM-YYYY");
    const time = dayjs(req.body.time).format("HH:mm");

    // Store date and time values as separate fields
    req.body.status = "pending";
    req.body.date = date;
    req.body.time = time;
    
    // Create a new appointment and save it to the database
    const newAppointment = new Appointment(req.body);
    await newAppointment.save()

    // Pushing notifications to Doctor based on the User Id
    const user = await User.findOne({ _id: req.body.doctorInfo.userId});
    user.unseenNotifications.push({
        type: "new-appointment-request",
        message: `A new appointment request has been made by ${req.body.userInfo.name}`,
        onClickPath: "/doctor/appointments"
    });
    await user.save();
    res.status(200).send({
        message: "Appointment booked successfully",
        success: true,
    })
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: "Error trying to book your appointment",
        success: false,
        error,
      });
  }
});

// Route to check availability of the appointments
router.post("/check-booking-availability", authMiddleware, async (req, res) => {
  try {
    const date = dayjs(req.body.date).format("DD-MM-YYYY").toString();
    const time = req.body.time;
    const doctorId = req.body.doctorId;

    const doctor = await Doctor.findOne({ _id: doctorId });
    if (!doctor) {
      return res.status(404).send({
        message: "Doctor not found",
        success: false,
      });
    }

    const fromTime = doctor.fromTime;
    const toTime = doctor.toTime;

    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointment is not available, please select a new time slot",
        success: false,
      });
    } else {
      res.status(200).send({
        message: "Appointment is available",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: "Error trying to check appointment availability",
        success: false,
        error,
      });
  }
});


// Route to get all the Appointments by user id
router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
    try {
        const appointments = await Appointment.find({userId: req.body.userId});
        res.status(200).send({
            message: "Appointments fetched successfully",
            success: true,
            data: appointments,
        })
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send({
                message: "Error getting appointments",
                success: false,
                error,
            });
    }
});

module.exports = router;
