const router = require("express").Router();

// setting up the controllers...
const { CreateUserDetails } = require("../controllers/userDetails");

router.post("/createUserDetails", CreateUserDetails);

module.exports = router;
