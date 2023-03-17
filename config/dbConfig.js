const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connect = mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.on("connected", () => {
    console.log("MongoDB has been connected successfully");
})

connection.on("error", (error) => {
    console.log("There is an Error in MongoDB connection", error);
})


module.exports = mongoose;