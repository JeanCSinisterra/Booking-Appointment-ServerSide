const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        specialization: {
            type: String,
            required: true
        },
        feePerConsultation: {
            type: Number,
            required: true,
        },
        yearsOfExperience: {
            type: Number,
            required: true,
        },
        fromTime: {
            type: Date,
            required: true,
        },
        toTime: { 
            type: Date,
            required: true,
        },
        status: {
            type: String,
            default: "pending"
        }
    }, {
    timestamps: true
})

const doctorModel = mongoose.model("doctors", doctorSchema);

module.exports = doctorModel;

