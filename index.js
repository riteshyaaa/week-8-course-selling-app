
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

//Import route handler



const app = express();


const { userRouter } = require("./routes/userRoutes");
const { courseRouter } = require("./routes/courseRoutes");
const { adminRouter } = require("./routes/adminRoutes");


app.use(express.json());
const PORT = process.env.PORT || 3000;

// Retrieve the MongoDB connection string (MONGODB_URL) from the .env file
const MONGODB_URL = process.env.MONGODB_URL;


// Use the imported routers for handling specific routes
// All user-related requests will go to /api/v1/user

app.use(express.json());


app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);


async function main() {
  try {
    // Connect to the MongoDB database using the MONGODB_URL
    await mongoose.connect(MONGODB_URL);

    // Log a success message to the console if the database connection is established
    console.log("Connected to the database");

    // Start the server and listen for incoming requests on the specified PORT
    app.listen(PORT, () => {
      // Log a message to indicate that the server is running and listening for requests
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    // Log an error message if the connection to the database fails
    console.error("Failed to connect to the database", error);
  }
}

// Invoke the main function to initiate the server and database connection
main();


