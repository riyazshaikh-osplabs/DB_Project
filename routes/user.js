const router = require("express").Router();

// setting up the middleware...
const { ValidateSignupFields, ValidateSigninFields, validateIdParam, ValidateUpdateFields, validateActivationStatus, ValidatePasswordFields, ErrorHandling }
    = require("../middlewares/auth");

// userSanitizer...
const { RoleExistsMiddleware, UserExistsByEmailSignin, UserExistsByEmailSignup, ValidateIsAdmin, ValidateIsNormalUser,
    CheckUserActivation, CheckUserForUserDetails, CheckUserForUserAccount, IsLoggedIn, CheckUserAccountSanitizer, FetchUserWithPassword }
    = require("../middlewares/userSanitizer");

// setting up the controllers...
const { SignUp, SignIn, DeleteUser, UserActivation, GetUserDetails, UpdateUser, PermanentDeleteUser, ChangeUserPassword } = require("../controllers/user");

// get routes...
router.get("/userDetails/:id", IsLoggedIn, ValidateIsNormalUser, validateIdParam, ErrorHandling, GetUserDetails);

// post rotues...
router.post("/signup", ValidateSignupFields, UserExistsByEmailSignup, RoleExistsMiddleware, ErrorHandling, SignUp);
router.post("/signin", ValidateSigninFields, UserExistsByEmailSignin, CheckUserActivation, CheckUserAccountSanitizer, ErrorHandling, SignIn);
router.post("/activation/:id", IsLoggedIn, ValidateIsNormalUser, validateIdParam, validateActivationStatus, CheckUserForUserAccount, ErrorHandling, UserActivation);


// put routes...
router.put("/editUser/:id", IsLoggedIn, ValidateIsNormalUser, validateIdParam, CheckUserForUserDetails, ValidateUpdateFields, ErrorHandling, UpdateUser);
router.put("/changePassword", IsLoggedIn, ValidateIsNormalUser, ValidatePasswordFields, FetchUserWithPassword, ErrorHandling, ChangeUserPassword);

// delete routes...
router.delete("/deleteUser/:id", IsLoggedIn, ValidateIsAdmin, validateIdParam, CheckUserForUserAccount, ErrorHandling, DeleteUser);
router.delete("/permanentDeleteUser/:id", IsLoggedIn, ValidateIsAdmin, validateIdParam, CheckUserForUserDetails, ErrorHandling, PermanentDeleteUser);

module.exports = router;