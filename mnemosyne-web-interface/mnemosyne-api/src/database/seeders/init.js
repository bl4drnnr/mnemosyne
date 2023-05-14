// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      await queryInterface.bulkInsert('roles', [
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
          value: 'AUTH_USER',
          description: 'Default role of authorized user.',
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
  }
};
