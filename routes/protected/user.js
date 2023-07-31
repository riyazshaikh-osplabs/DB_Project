const router = require("express").Router();

// setting up the middleware...
const { validateIdParam, ValidateUpdateFields, validateActivationStatus, ValidatePasswordFields, ErrorHandling } = require("../../middlewares/auth");

// userSanitizer...
const { ValidateIsAdmin, ValidateIsNormalUser, CheckUserForUserDetails,
    CheckUserForUserAccount, IsLoggedIn, FetchUserWithPassword } = require("../../middlewares/userSanitizer");

// setting up the controllers...
const { DeleteUser, UserActivation, GetUserDetails, UpdateUser, PermanentDeleteUser, ChangeUserPassword } = require("../../controllers/user");

router.get("/userDetails/:id", IsLoggedIn, ValidateIsNormalUser, validateIdParam, ErrorHandling, GetUserDetails);

router.post("/activation/:id", validateIdParam, ErrorHandling, IsLoggedIn, ValidateIsNormalUser, validateActivationStatus, CheckUserForUserAccount, UserActivation);

router.put("/editUser/:id", validateIdParam, ErrorHandling, IsLoggedIn, ValidateIsNormalUser, CheckUserForUserDetails, ValidateUpdateFields, UpdateUser);
router.put("/changePassword", ValidatePasswordFields, ErrorHandling, IsLoggedIn, ValidateIsNormalUser, FetchUserWithPassword, ChangeUserPassword);

router.delete("/deleteUser/:id", validateIdParam, ErrorHandling, IsLoggedIn, ValidateIsAdmin, CheckUserForUserAccount, DeleteUser);
router.delete("/permanentDeleteUser/:id", validateIdParam, ErrorHandling, IsLoggedIn, ValidateIsAdmin, CheckUserForUserDetails, PermanentDeleteUser);

module.exports = router;