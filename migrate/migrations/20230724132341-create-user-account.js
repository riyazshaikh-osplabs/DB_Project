'use strict';

const { generateDate } = require('../../utils/utils');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserAccount', {

      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      CreatedOn: {
        type: Sequelize.DATE,
        defaultValue: () => generateDate(),
        allowNull: true
      },

      LastLoginIn: {
        type: Sequelize.DATE,
        defaultValue: () => generateDate(),
        allowNull: true
      },

      IsDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true
      },

      IsDisabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true
      },

      RoleId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'UserRole',
          key: 'RoleId'
        },
      },

    }, { freezeTableName: true, timestamps: false });

    await queryInterface.addConstraint('UserAccount', {

      fields: ['RoleId'],
      type: 'foreign key',

      references: {
        table: 'UserRole',
        field: 'RoleId'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserAccount');
  }
};
