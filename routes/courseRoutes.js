const {Router} = require("express");
const { userMiddleware } = require("../middlewares/user");
const { courseModel, purchaseModel } = require("../db");
const courseRouter = Router();

// purchase a course 
courseRouter.post("/purchase", userMiddleware, async(req, res) => {
    const userId =  req.userId;
console.log(userId);
   
    // Extract courseId from the request body sent by the client
    const courseId = req.body.courseId;

    // If courseId is not provided in the request body, return a 400 error response to the client
    if (!courseId) {
        return res.status(400).json({
            message: "Please provide a courseId", // Error message sent back to the client
        });
    }
    const existingPurchases =  await purchaseModel.find({
        userId,
        courseId
    })
    if(!existingPurchases){
        return res.status(400).json({
            message: "You have already purchased this course"
        })
    }
        
    // Create a new purchase record
    const newPurchase =  await purchaseModel.create({
        userId,
        courseId
    })
    if(!newPurchase){
        return res.status(400).json({
            message: "Error purchasing course"
        })
    }
    // Return the newly created purchase record to the client
    res.json({
        message: "Course purchased successfully",
        purchaseId: newPurchase  // Return the purchaseId in the response
    })

})

courseRouter.get("/preview", async(req, res) => {
    // Query the database to get all the courses available for purchase
    const courses = await courseModel.find({});

    // Return the queried course details as a JSON response to the client with a 200 status code
    res.status(200).json({
        courses: courses, // Send the course details back to the client
    });

   
    
})

module.exports = {
    courseRouter: courseRouter
}
