
const router = require("express").Router();

const ensureAuthenticated = require("../middleware/ensureAuthenticated");


router.get("/",(req,res)=> {
    res.render('home')
})

router.get("/dashboard", (req,res)=> {
    console.log(req.body)
    res.render('dashboard')
})

module.exports = router;
