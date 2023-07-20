const router = require("express").Router();

// setting up the controllers...
const { CreateUserAccount } = require("../controllers/userAccount");

router.post("/signupUserAccount", CreateUserAccount);

module.exports = router;
