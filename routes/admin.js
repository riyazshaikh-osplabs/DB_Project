const router = require("express").Router();


// setting up the controllers...
const { AdminSignIn, ViewEngine } = require("../controllers/admin");

// setting up the userSanittizer...
const { UserExistsByEmailSignin, IsLoggedIn, CheckUserAccountSanitizer, } = require("../middlewares/userSanitizer");

// setting up the middlewares...
const { ValidateSigninFields, ErrorHandling } = require("../middlewares/auth");
const ProtectedRoutes = require("./protected/admin");


router.get("/viewEngine", ViewEngine);

router.post('/signin', ValidateSigninFields, ErrorHandling, UserExistsByEmailSignin, CheckUserAccountSanitizer, AdminSignIn);

router.use("/protected", IsLoggedIn, ProtectedRoutes);

module.exports = router;