const router = require("express").Router();


// setting up the controllers...
const { AdminSignIn, GetAdminDetails, GetUsersList, UpdateAdminUserPassword, UpdateNormalUser } = require("../controllers/admin");

// setting up the userSanittizer...
const { RoleExistsMiddleware, UserExistsByEmailSignin, UserExistsByEmailSignup, ValidateIsAdmin, ValidateIsNormalUser,
    CheckUserActivation, CheckUserForUserDetails, CheckUserForUserAccount, IsLoggedIn, CheckUserAccountSanitizer, FetchUserWithPassword } = require("../middlewares/userSanitizer");

// setting up the middlewares...
const { ValidateSigninFields, validateIdParam, ValidateUpdateFields, validateActivationStatus, ValidatePasswordFields, ErrorHandling } = require("../middlewares/auth");


// get routes...
router.get('/details', IsLoggedIn, ValidateIsAdmin, ErrorHandling, GetAdminDetails);
router.get('/list', IsLoggedIn, ValidateIsAdmin, ErrorHandling, GetUsersList);

// post routes....
router.post('/signin', ValidateSigninFields, UserExistsByEmailSignin, CheckUserAccountSanitizer, ErrorHandling, AdminSignIn);
router.put("/changePassword", IsLoggedIn, ValidatePasswordFields, ValidateIsAdmin, FetchUserWithPassword, ErrorHandling, UpdateAdminUserPassword);

// put routes....
router.put("/editUser/:id", IsLoggedIn, ValidateIsAdmin, validateIdParam, CheckUserForUserAccount, CheckUserForUserDetails, ErrorHandling, UpdateNormalUser);

// delete routes..
// router.delete();

module.exports = router;