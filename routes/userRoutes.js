const { Router } = require("express");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const { userModel } = require("../db");
const jwt =  require("jsonwebtoken");
const JWT_SECRET = "ritesh123"


const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const UserSchema = z.object({
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

  const parseDataWithSuccess =  UserSchema.safeParse(req.body);

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
    await  userModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
  }catch (err) {
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
userRouter.post("/signin", async (req, res) => {
const { email, password } = req.body;
try {
  
  const user = await userModel.findOne({email})

if(!user){
  return res.json({
    message: "  user not found!"
  })
}
const isPasswordCorrect = await bcrypt.compare(password, user.password)
if (isPasswordCorrect) {
  // Create a JWT token using the jwt.sign() method
  const token = jwt.sign(
      {
          id: user._id.toString(),
      },
      JWT_SECRET
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
} catch (error) {
  
}


});
userRouter.get("/purchases", (req, res) => {
  res.send("SignUP is done!");
});

module.exports = { userRouter: userRouter };
