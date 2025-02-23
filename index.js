const express = require("express");

const app = express();

const { userRouter } = require("./routes/userRoutes");
const { courseRouter } = require("./routes/courseRoutes");
const { adminRouter } = require("./routes/adminRoutes");

app.use(express.json());

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
