const mongoose = require("mongoose");
<<<<<<< HEAD
=======

mongoose.connect(
    "mongodb+srv://ratanakaryaa:wmMjXlfjZZu4QHx6@cluster0.pdvgs.mongodb.net/online-courses-app"
  );

>>>>>>> c65878e16de3846842d2183b841f4e383424d46b
const { Schema } = mongoose;

const objectId = Schema.Types.ObjectId;

const userSchema = new Schema({
<<<<<<< HEAD
  firstName: String, 
=======
  firstName: String,
>>>>>>> c65878e16de3846842d2183b841f4e383424d46b
  lastName: String,
  email:  {
    type: String, 
    unique: true, 
    required: true,},
     // Add this
  password: String,
});
const adminSchema = new Schema({
  firstName: String,
  lastName: String,
  email:  { 
    type: String, 
    unique: true, 
    required: true,
    
  },
  password: String,
});
const courseSChema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: objectId,
});

const purchaseSChema = new Schema({
  userId: objectId,
  courseId: objectId,
});

const userModel = mongoose.model("users", userSchema);
const adminModel = mongoose.model("admins", adminSchema);
const courseModel = mongoose.model("courses", courseSChema);
const purchaseModel = mongoose.model("purchases", purchaseSChema);

module.exports = {
  userModel,
  adminModel,
  courseModel,
  purchaseModel,
};
