require("dotenv").config();
const express = require("express");
const { PageNotFound, SendError } = require("./utils/utils");

// setting up the routes...
const RouteHandler = require("./routes/index");

// setting up the server...
const PORT = process.env.PORT;
const app = express();
app.listen(PORT, async () => {
  console.log(`listening at http://localhost:${PORT}`);
});

// parsing the data
app.use(express.json());

app.use("/api/route", RouteHandler);

// setting up the  application level middleware
app.use(SendError);

// settingi up the 404 route...
app.use(PageNotFound);
