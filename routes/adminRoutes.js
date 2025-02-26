const { Router } = require("express");
const { adminModel, courseModel } = require("../db");
const adminRouter = Router();
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middlewares/admin");

adminRouter.post("/signup", async (req, res) => {
  const AdminSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*]/, {
        message: "Password must contain at least one special character",
      }),
    firstName: z
      .string()
      .min(1, { message: "First name is required" })
      .max(50, { message: "First name must be less than 50 characters" }),
    lastName: z
      .string()
      .min(1, { message: "Last name is required" })
      .max(50, { message: "Last name must be less than 50 characters" }),
  });

  const parseDataWithSuccess = AdminSchema.safeParse(req.body);

  if (!parseDataWithSuccess.success) {
    return res.json({
      message: "Incorrect data format",
      error: parseDataWithSuccess.error,
    });
  }

  const { email, password, firstName, lastName } = req.body;
  const hashedPassword = await bcrypt.hash(password, 5);
  // console.log(hashedPassword

  // Error handling for creating a new user
  try {
    // Create a new user using the UserModel.create() method
    await adminModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.json({
        message: "Email already exists",
      });
    }
    return res.json({
      message: "Error creating user",
      error: err.message,
    });
  }

  return res.json({
    message: "User created successfully!",
  });
  // This is the another way to  create a new user using the UserModel.create() method
});
adminRouter.post("/signin", async (req, res) => {
  // Validate the request body data using z schema (email, password must be valid)
  const requireBody = z.object({
    email: z.string().email(), // Email must be a valid format
    password: z.string().min(3), // Password must be at least 6 characters
  });

  // Parse and validate the request body data
  const parseDataWithSuccess = requireBody.safeParse(req.body);

  // If the data format is incorrect, send an error message to the client
  if (!parseDataWithSuccess.success) {
    return res.json({
      message: "Incorrect data format",
      error: parseDataWithSuccess.error,
    });
  }

  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.json({
        message: "  Incorrect credentials",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (isPasswordCorrect) {
      

      // Create a JWT token using the jwt.sign() method
      const token = jwt.sign(
        {
          id: admin._id.toString(),
        },
        JWT_ADMIN_PASSWORD
      );

      // Send the token to the client
      res.json({
        token: token,
        message: "You are signed in!",
      });
    } else {
      // If the user is not found, send an error message to the client
      res.status(403).json({
        message: "Invalid Credentials!",
      });
    }
  } catch (error) {}
});
//Define the admin routes for admin to creating the courses
adminRouter.post("/course", adminMiddleware, async (req, res) => {
  //get  the admin id for authorization
  const adminId = req.adminId;
  // Validate the request body data using zod schema (title, description, imageUrl, price must be valid)
  const requireBody = z.object({
    title: z.string().min(10), // Title must be at least 10 characters
    description: z.string().min(10), // Description must be at least 10 characters
    imageUrl: z.string().url(), // Image URL must be a valid URL
    price: z.number().positive(), // Price must be a positive number
  });

  // Parse and validate the request body data
  const parseDataWithSuccess = requireBody.safeParse(req.body);

  // If the data format is incorrect, send an error message to the client
  if (!parseDataWithSuccess.success) {
    return res.json({
      message: "Incorrect data format",
      error: parseDataWithSuccess.error,
    });
  }

  const { title, description, imageUrl, price } = req.body;
  const course = await courseModel.create({
    title,
    description,
    imageUrl,
    price,
    creatorId: adminId,
  });

  res.status(201).json({
    message: "Course created!",
    courseId: course,
  });
});

//Define the admin routes for admin to uodate the courses
adminRouter.put("/course", adminMiddleware, async (req, res) => {
  const adminId = req.adminId;
  const requireBody = z.object({
    title: z.string().min(3),
    courseId: z.string().min(3),
    description: z.string().min(10),
    price: z.number().positive().optional(),
    imageUrl: z.string().url().optional(),
  });

  const parseDataWithSuccess = requireBody.safeParse(req.body);
  if (!parseDataWithSuccess.success) {
    return res.json({
      message: "Incorrect data format",
      error: parseDataWithSuccess.error,
    });
  }
  const { courseId, title, description, imageUrl, price } = req.body;

  const course = await courseModel.findOne({
    _id: courseId,
    creatorId: adminId,
    
  });
 
  // If the course is not found, respond with an error message
  if (!course) {
    return res.status(404).json({
      message: "Course not found!", // Inform the client that the specified course does not exist
    });
  }

   const updatedCourse = await courseModel.updateOne(
    {
      _id: courseId, // Match the course by ID
      creatorId: adminId, // Ensure the admin is the creator
    },
    {
      title: title || course.title, // Update title if provided, otherwise keep the existing title
      description: description || course.description, // Update description if provided, otherwise keep the existing description
      imageUrl: imageUrl || course.imageUrl, // Update imageUrl if provided, otherwise keep the existing imageUrl
      price: price || course.price, // Update price if provided, otherwise keep the existing price
    }
  );
  res.status(200).json({
    message: "Course updated!", // Confirm successful course update
    courseId: updatedCourse,
  });
});

adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
  const adminId = req.adminId;
  const courses = await courseModel.find({
    creatorId: adminId,
  });
  if (!courses.length)
    return res.status(404).json({ message: "Course not found" });
  res.json({
    courses,
  });
});

module.exports = {
  adminRouter: adminRouter,
};
