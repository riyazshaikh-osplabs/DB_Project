const router = require("express").Router();

// setting up the middleware...
const { ValidateSignupFields, ValidateSigninFields, ErrorHandling } = require("../middlewares/auth");

// userSanitizer...
const { RoleExistsMiddleware, UserExistsByEmailSignin, UserExistsByEmailSignup,
    CheckUserActivation, IsLoggedIn, CheckUserAccountSanitizer } = require("../middlewares/userSanitizer");

const ProtectedRoutes = require("./protected/user");

// setting up the controllers...
const { SignUp, SignIn } = require("../controllers/user");


// post rotues...
router.post("/signup", ValidateSignupFields, ErrorHandling, UserExistsByEmailSignup, RoleExistsMiddleware, SignUp);
router.post("/signin", ValidateSigninFields, ErrorHandling, UserExistsByEmailSignin, CheckUserActivation, CheckUserAccountSanitizer, SignIn);


router.use("/protected", IsLoggedIn, ProtectedRoutes);

module.exports = router;