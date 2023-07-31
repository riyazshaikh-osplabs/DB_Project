'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('UserDetails', 'profilePicUrl', {
      type: Sequelize.STRING,
      defaultValue: null,
      allowNull: true
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('UserDetails', 'profilePicUrl');
  }
};
