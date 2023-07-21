const router = require("express").Router();

// setting up the middleware...
const { ValidateSignupFields, ValidateSigninFields, validateIdParam, ErrorHandling } = require("../middlewares/auth")

// setting up the controllers...
const { SignUp, SignIn, DeleteUser, UserActivation, GetUserDetails } = require("../controllers/user")

router.get("/userDetails/:id", validateIdParam, ErrorHandling, GetUserDetails);
router.post("/signup", ValidateSignupFields, ErrorHandling, SignUp);
router.post("/signin", ValidateSigninFields, ErrorHandling, SignIn);
router.post("/activation/:id", validateIdParam, ErrorHandling, UserActivation);
router.delete("/deleteUser/:id", validateIdParam, ErrorHandling, DeleteUser);

module.exports = router;
