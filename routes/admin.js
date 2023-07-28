const router = require("express").Router();


// setting up the controllers...
const { AdminSignIn, GetAdminDetails, GetUsersList, UpdateAdminUserPassword, UpdateNormalUser, ViewEngine } = require("../controllers/admin");

// setting up the userSanittizer...
const { UserExistsByEmailSignin, ValidateIsAdmin, CheckUserForUserDetails, CheckUserForUserAccount,
    IsLoggedIn, CheckUserAccountSanitizer, FetchUserWithPassword } = require("../middlewares/userSanitizer");

// setting up the middlewares...
const { ValidateSigninFields, validateIdParam, ValidatePasswordFields, ErrorHandling } = require("../middlewares/auth");

router.get('/details', ValidateIsAdmin, ErrorHandling, IsLoggedIn, GetAdminDetails);
router.get('/list', IsLoggedIn, ValidateIsAdmin, ErrorHandling, GetUsersList);
router.get("/viewEngine", ViewEngine);

// post routes....
router.post('/signin', ValidateSigninFields, ErrorHandling, UserExistsByEmailSignin, CheckUserAccountSanitizer, AdminSignIn);
router.put("/changePassword", ValidatePasswordFields, ErrorHandling, IsLoggedIn, ValidateIsAdmin, FetchUserWithPassword, UpdateAdminUserPassword);

// put routes....
router.put("/editUser/:id", validateIdParam, ErrorHandling, IsLoggedIn, ValidateIsAdmin, CheckUserForUserAccount, CheckUserForUserDetails, UpdateNormalUser);

// delete routes..
// router.delete();

module.exports = router;