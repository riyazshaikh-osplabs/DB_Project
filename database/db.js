const { Sequelize } = require("sequelize");
const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_DIALECT } = process.env;

// making the sequelize instance...
const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: console.log,
});

sequelize
  .authenticate()
  .then(() => console.log(`database connected successfully...`))
  .catch((error) => console.log(`database connection failed... ${error} `));


module.exports = { sequelize };
