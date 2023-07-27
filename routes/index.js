const router = require("express").Router();

// setting up the routes...
const UserAccountRoute = require("./user");
const AdminAccountRoute = require("./admin")

router.use("/user", UserAccountRoute);
router.use("/admin", AdminAccountRoute);

module.exports = router;
