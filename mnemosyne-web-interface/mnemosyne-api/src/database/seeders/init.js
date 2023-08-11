// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      await queryInterface.bulkInsert('roles', [
        {
          id: uuid.v4(),
          value: 'PRIMARY_ADMIN',
          description: 'Primary company owner email address.',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid.v4(),
          value: 'ADMIN',
          description:
            'The highest level of permissions. Created by default and cannot be deleted.',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid.v4(),
          value: 'USER',
          description: 'Default role of user.',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid.v4(),
          value: 'READ_ONLY',
          description: 'Read only access.',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
    } catch (e) {
      console.log(`Error while initiation of the database: ${e}`);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('confirmation_hashes', null, {});
  }
};
