
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserDetails', {

      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'UserAccount',
          key: 'UserId'
        },
      },

      Email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },

      Password: {
        type: Sequelize.STRING,
        allowNull: false
      },

      FirstName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      LastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
    }, { freezeTableName: true, timestamps: false });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserDetails');
  }
};
