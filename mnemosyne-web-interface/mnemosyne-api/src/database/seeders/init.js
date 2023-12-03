/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      // await queryInterface.bulkInsert('roles', [
      //   {
      //     id: uuid.v4(),
      //     value: 'PRIMARY_ADMIN',
      //     description: 'Primary company owner email address.',
      //     created_at: new Date(),
      //     updated_at: new Date()
      //   },
      //   {
      //     id: uuid.v4(),
      //     value: 'ADMIN',
      //     description: 'Allows to control users\' access',
      //     created_at: new Date(),
      //     updated_at: new Date()
      //   },
      //   {
      //     id: uuid.v4(),
      //     value: 'DEFAULT',
      //     description: 'Default role of user. Read and write.',
      //     created_at: new Date(),
      //     updated_at: new Date()
      //   }
      // ]);
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
