/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      await queryInterface.bulkInsert('categories', [
        {
          id: 'f5ee748e-dca0-47d0-89fd-090b7307c80f',
          name: 'house',
          description: 'house_desc',
          sub_categories: ['kitchen', 'bedroom', 'bathroom', 'decoration'],
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'e434f6ec-ac94-427d-bd05-7a0d07ed5891',
          name: 'travels',
          description: 'travels_desc',
          sub_categories: ['hiking', 'cycling', 'swimming'],
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '67312d4a-991b-43b0-87de-bd597383c528',
          name: 'business',
          description: 'business_desc',
          sub_categories: ['finance', 'equipment', 'business_software', 'service'],
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '24a4b8f9-8b7b-4caf-8080-af3ac1437f63',
          name: 'cooking',
          description: 'cooking_desc',
          sub_categories: ['ingredients', 'dishes', 'cooking_books'],
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'ef5e2997-60da-4550-954a-ce1db8c67d27',
          name: 'sports',
          description: 'sports_desc',
          sub_categories: ['sports_equipment', 'train'],
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'ae8d810e-92b2-4d56-b798-dfe3c0c96158',
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
