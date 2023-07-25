const router = require("express").Router();

// setting up the middleware...
const { ValidateSignupFields, ValidateSigninFields, validateIdParam, ValidateUpdateFields, ErrorHandling } = require("../middlewares/auth");

const { RoleExistsMiddleware, UserExistsByEmailSignin, UserExistsByEmailSignup,
    CheckUserActivation, CheckUserForUserDetails, CheckUserForUserAccount } = require("../middlewares/userSanitizer");

// setting up the controllers...
const { SignUp, SignIn, DeleteUser, UserActivation, GetUserDetails, UpdateUser, PermanentDeleteUser } = require("../controllers/user");

// get routes...
router.get("/userDetails/:id", validateIdParam, ErrorHandling, GetUserDetails);

// post rotues...
router.post("/signup", ValidateSignupFields, UserExistsByEmailSignup, RoleExistsMiddleware, ErrorHandling, SignUp);
router.post("/signin", ValidateSigninFields, CheckUserForUserAccount, UserExistsByEmailSignin, CheckUserActivation, ErrorHandling, SignIn);
router.post("/activation/:id", validateIdParam, CheckUserForUserAccount, ErrorHandling, UserActivation);


// put routes...
router.put("/editUser/:id", validateIdParam, CheckUserForUserDetails, ValidateUpdateFields, ErrorHandling, UpdateUser);

// delete routes...
router.delete("/deleteUser/:id", validateIdParam, CheckUserForUserAccount, ErrorHandling, DeleteUser);
router.delete("/permanentDeleteUser/:id", validateIdParam, CheckUserForUserDetails, ErrorHandling, PermanentDeleteUser);

module.exports = router;
