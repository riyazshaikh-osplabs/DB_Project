'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.bulkInsert('UserRole', [
      { Role: 'Admin' },
      { Role: 'Developer' },
      { Role: 'Tester' },
      { Role: 'Technical Lead' }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('UserRole', null, {});
  }
};
