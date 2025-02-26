const {Router} = require("express");
const courseRouter = Router();


courseRouter.post("/purchase", (req, res) => {
    res.send("SignUP is done!")
})

courseRouter.get("/preview", (req, res) => {
<<<<<<< HEAD
    res.send("SignUP is done!") 
=======
    res.send("SignUP is done!")
>>>>>>> c65878e16de3846842d2183b841f4e383424d46b
})

module.exports = {
    courseRouter: courseRouter
}
