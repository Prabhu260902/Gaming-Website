const { Router } = require("express");
const router = Router();
const { requireAuth } = require("../middleware/authMiddleware");
require("dotenv").config();
const { Getregister, Getlogin, Postregister, Postlogin, Getprofile,
     Postprofile, Postgetdata, Gettempprofile, PostgetProfileLogo, Postupload, 
     Getlogout, Getchangeprofile, GetleaderBoard } = require("../controllers/authentication");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.get("/register",Getregister);
router.get("/login",Getlogin);
router.get("/logout", Getlogout)
router.get('/leaderBoard',requireAuth, GetleaderBoard)
router.get('/changeProfile',requireAuth, Getchangeprofile)

router.post("/register",Postregister)
router.post("/login",Postlogin)  


router.get("/profile", requireAuth , Getprofile)
router.post('/profile',requireAuth , Postprofile)

router.post('/getData',requireAuth,Postgetdata)
router.get('/tempProfile',requireAuth , Gettempprofile);
router.post('/upload', upload.single('file'), Postupload)
router.post('/getProfileLogo',requireAuth,PostgetProfileLogo)


module.exports = router; 