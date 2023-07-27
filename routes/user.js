const router = require("express").Router();

// setting up the middleware...
const { ValidateSignupFields, ValidateSigninFields, validateIdParam, ValidateUpdateFields, validateActivationStatus, ValidatePasswordFields, HelloUser, ErrorHandling } = require("../middlewares/auth");

// userSanitizer...
const { RoleExistsMiddleware, UserExistsByEmailSignin, UserExistsByEmailSignup, ValidateIsAdmin, ValidateIsNormalUser,
    CheckUserActivation, CheckUserForUserDetails, CheckUserForUserAccount, IsLoggedIn, CheckUserAccountSanitizer, FetchUserWithPassword }
    = require("../middlewares/userSanitizer");

// setting up the controllers...
const { SignUp, SignIn, DeleteUser, UserActivation, GetUserDetails, UpdateUser, PermanentDeleteUser, ChangeUserPassword, User } = require("../controllers/user");

// get routes...
router.get("/userDetails/:id", validateIdParam, ErrorHandling, IsLoggedIn, ValidateIsNormalUser, GetUserDetails);

// post rotues...
router.post("/signup", ValidateSignupFields, UserExistsByEmailSignup, RoleExistsMiddleware, ErrorHandling, SignUp);
router.post("/signin", ValidateSigninFields, UserExistsByEmailSignin, CheckUserActivation, CheckUserAccountSanitizer, ErrorHandling, SignIn);
router.post("/activation/:id", validateIdParam, validateActivationStatus, CheckUserForUserAccount, IsLoggedIn, ErrorHandling, UserActivation);


// put routes...
router.put("/editUser/:id", validateIdParam, CheckUserForUserDetails, ValidateUpdateFields, IsLoggedIn, ErrorHandling, UpdateUser);
router.put("/changePassword", IsLoggedIn, ValidatePasswordFields, IsLoggedIn, FetchUserWithPassword, ErrorHandling, ChangeUserPassword);

// delete routes...
router.delete("/deleteUser/:id", validateIdParam, CheckUserForUserAccount, ErrorHandling, IsLoggedIn, DeleteUser);
router.delete("/permanentDeleteUser/:id", validateIdParam, CheckUserForUserDetails, ErrorHandling, IsLoggedIn, PermanentDeleteUser);

module.exports = router;
