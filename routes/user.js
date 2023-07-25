const router = require("express").Router();

// setting up the middleware...
const { ValidateSignupFields, ValidateSigninFields, validateIdParam, ValidateUpdateFields, validateActivationStatus, ErrorHandling } = require("../middlewares/auth");

const { RoleExistsMiddleware, UserExistsByEmailSignin, UserExistsByEmailSignup,
    CheckUserActivation, CheckUserForUserDetails, CheckUserForUserAccount, IsLoggedIn } = require("../middlewares/userSanitizer");

// setting up the controllers...
const { SignUp, SignIn, DeleteUser, UserActivation, GetUserDetails, UpdateUser, PermanentDeleteUser } = require("../controllers/user");

// get routes...
router.get("/userDetails/:id", validateIdParam, ErrorHandling, IsLoggedIn, GetUserDetails);

// post rotues...
router.post("/signup", ValidateSignupFields, UserExistsByEmailSignup, RoleExistsMiddleware, ErrorHandling, SignUp);
router.post("/signin", ValidateSigninFields, UserExistsByEmailSignin, CheckUserActivation, ErrorHandling, SignIn);
router.post("/activation/:id", validateIdParam, validateActivationStatus, CheckUserForUserAccount, IsLoggedIn, ErrorHandling, UserActivation);


// put routes...
router.put("/editUser/:id", validateIdParam, CheckUserForUserDetails, ValidateUpdateFields, IsLoggedIn, ErrorHandling, UpdateUser);

// delete routes...
router.delete("/deleteUser/:id", validateIdParam, CheckUserForUserAccount, ErrorHandling, IsLoggedIn, DeleteUser);
router.delete("/permanentDeleteUser/:id", validateIdParam, CheckUserForUserDetails, ErrorHandling, IsLoggedIn, PermanentDeleteUser);

module.exports = router;
