'use strict';
const bcrypt = require("bcryptjs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const adminUserDetails = {
      UserId: 1,
      Email: 'riyaz@osplabs.com',
      Password: bcrypt.hashSync("Riyaz_0712", 10),
      FirstName: 'Riyaz',
      LastName: 'Shaikh'
    };

    await queryInterface.bulkInsert('UserDetails', [adminUserDetails], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserDetails', { Email: 'riyaz@osplabs.com', }, {});
  }
};
