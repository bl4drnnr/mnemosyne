/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      //
    } catch (e) {
      console.log(`Error while initiation of the database: ${e}`);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('company_users', null, {});
    await queryInterface.bulkDelete('companies', null, {});
    await queryInterface.bulkDelete('sessions', null, {});
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('users_settings', null, {});
    await queryInterface.bulkDelete('confirmation_hashes', null, {});
    await queryInterface.bulkDelete('user_roles', null, {});
  }
};
