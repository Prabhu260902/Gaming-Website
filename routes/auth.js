const { Router } = require("express");
const router = Router();
const { requireAuth } = require("../middleware/authMiddleware");
require("dotenv").config();
const { Getregister, Getlogin, Postregister, Postlogin, Getprofile, Postprofile, Postgetdata, Gettempprofile, PostgetProfileLogo, Postupload } = require("../controllers/authentication");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.get("/register",Getregister);
router.get("/login",Getlogin);
router.post("/register",Postregister)
router.post("/login",Postlogin)  
router.get("/logout", (req,res) => {
    res.cookie('jwt','',{maxAge: 1});
    res.redirect('/')
})
router.get('/changeProfile',requireAuth, (req,res)=>{
    res.render('changeProfile');
})
router.get("/profile", requireAuth , Getprofile)
router.post('/profile',requireAuth , Postprofile)
router.get('/leaderBoard',requireAuth, (req,res)=>{
    res.render('leaderBoard');
})
router.post('/getData',requireAuth,Postgetdata)
router.get('/tempProfile',requireAuth , Gettempprofile);
router.post('/upload', upload.single('file'), Postupload)
router.post('/getProfileLogo',requireAuth,PostgetProfileLogo)


module.exports = router; 