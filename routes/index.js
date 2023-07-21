const router = require("express").Router();

// setting up the routes...
const UserAccountRoute = require("./user");

router.use("/userAccount", UserAccountRoute);

module.exports = router;
