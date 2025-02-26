const {Router} = require("express");
const courseRouter = Router();


courseRouter.post("/purchase", (req, res) => {
    res.send("SignUP is done!")
})

courseRouter.get("/preview", (req, res) => {
    res.send("SignUP is done!") 
})

module.exports = {
    courseRouter: courseRouter
}
