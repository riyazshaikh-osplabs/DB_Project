'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserRole', {

      RoleId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      Role: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserRole');
  }
};