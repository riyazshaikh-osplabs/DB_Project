const router = require("express").Router();

// setting up the middleware...
const { ValidateSignupFields, ValidateSigninFields, validateIdParam, ValidateUpdateFields, ErrorHandling } = require("../middlewares/auth");
const { RoleExistsMiddleware, UserExistsByEmailSignin, UserExistsByEmailSignup, CheckUserActivation } = require("../middlewares/userSanitizer");

// setting up the controllers...
const { SignUp, SignIn, DeleteUser, UserActivation, GetUserDetails, UpdateUser, PermanentDeleteUser } = require("../controllers/user");

// get routes...
router.get("/userDetails/:id", validateIdParam, ErrorHandling, GetUserDetails);

// post rotues...
router.post("/signup", ValidateSignupFields, UserExistsByEmailSignup, RoleExistsMiddleware, ErrorHandling, SignUp);
router.post("/signin", ValidateSigninFields, UserExistsByEmailSignin, CheckUserActivation, ErrorHandling, SignIn);
router.post("/activation/:id", validateIdParam, ErrorHandling, UserActivation);


// put routes...
router.put("/editUser/:id", validateIdParam, ValidateUpdateFields, ErrorHandling, UpdateUser);

// delete routes...
router.delete("/deleteUser/:id", validateIdParam, ErrorHandling, DeleteUser);
router.delete("/permanentDeleteUser/:id", PermanentDeleteUser);

module.exports = router;
