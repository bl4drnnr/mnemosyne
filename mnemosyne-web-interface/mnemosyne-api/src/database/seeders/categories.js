const uuid = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      await queryInterface.bulkInsert('categories', [
        {
          id: uuid.v4(),
          name: 'house',
          description: 'house_desc',
          sub_categories: ['kitchen', 'bedroom', 'bathroom', 'decoration'],
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid.v4(),
          name: 'travels',
          description: 'travels_desc',
          sub_categories: ['hiking', 'cycling', 'swimming'],
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid.v4(),
          name: 'business',
          description: 'business_desc',
          sub_categories: ['finance', 'equipment', 'business_software', 'service'],
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid.v4(),
          name: 'cooking',
          description: 'cooking_desc',
          sub_categories: ['ingredients', 'dishes', 'cooking_books'],
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid.v4(),
          name: 'sports',
          description: 'sports_desc',
          sub_categories: ['sports_equipment', 'train'],
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid.v4(),
          name: 'computers',
          description: 'computers_desc',
          sub_categories: ['hardware', 'software', 'it_books'],
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
    } catch (e) {
      console.log(`Error while adding categories to the database: ${e}`);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
