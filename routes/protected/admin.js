const router = require("express").Router();

// setting up the controllers...
const { GetAdminDetails, GetUsersList, UpdateAdminUserPassword, UpdateNormalUser } = require("../../controllers/admin");

// setting up the userSanittizer...
const { ValidateIsAdmin, CheckUserForUserDetails, CheckUserForUserAccount, FetchUserWithPassword } = require("../../middlewares/userSanitizer");

// setting up the middlewares...
const { validateIdParam, ValidatePasswordFields, ErrorHandling } = require("../../middlewares/auth");

// get routes...
router.get('/details', ValidateIsAdmin, ErrorHandling, GetAdminDetails);
router.get('/list', ValidateIsAdmin, ErrorHandling, GetUsersList);

// post routes...
router.put("/changePassword", ValidatePasswordFields, ErrorHandling, ValidateIsAdmin, FetchUserWithPassword, UpdateAdminUserPassword);

// put routes....
router.put("/editUser/:id", validateIdParam, ErrorHandling, ValidateIsAdmin, CheckUserForUserAccount, CheckUserForUserDetails, UpdateNormalUser);

module.exports = router;