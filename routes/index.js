const router = require("express").Router();

// setting up the routes...
const UserAccountRoute = require("./userAccount");
const UserDetailsRoute = require("./userDetails");
const UserRoleRoute = require("./userRole");

router.use("/userAccount", UserAccountRoute);
router.use("/userDetails", UserDetailsRoute);
router.use("/userRole", UserRoleRoute);

module.exports = router;
