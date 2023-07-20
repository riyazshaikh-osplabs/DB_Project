const router = require("express").Router();

// setting up the controllers...
const { CreateUserAccount } = require("../controllers/userAccount");

router.get("/signup", CreateUserAccount);

module.exports = router;
