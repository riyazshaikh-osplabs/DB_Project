'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const adminUserAccount = {
      UserId: 1,
      CreatedOn: '2023-07-26T05:59:18.665Z',
      LastLoginIn: '2023-07-26T05:59:18.665Z',
      IsDeleted: false,
      IsDisabled: false,
      IsAdmin: true,
      RoleId: 1
    };

    await queryInterface.bulkInsert('UserAccount', [adminUserAccount], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserAccount', null, {});
  }
};
