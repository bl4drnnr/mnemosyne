/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      // User hash: 71956c9eea017cb85242a49f416fd859
      await queryInterface.bulkInsert('users', [
        {
          id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          email: 'mikhail.bahdashych@gmail.com',
          password: '$2a$10$1HvnaYFhmlKAT/kmpA2rDOu3jSXqzRoBsbeFUrHLQoqKQgl8lsUba',
          first_name: 'Mikhail',
          last_name: 'Bahdashych',
          home_address: '5th Street, New York, 00-001',
          home_phone: '123123123',
          is_mfa_set: true,
          tac: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
      await queryInterface.bulkInsert('confirmation_hashes', [
        {
          id: 'd1486e56-88fc-4774-9c28-48a1b70e6f8b',
          confirmation_hash: '7a860d74af63e0fab36585e8fea66e5693017448',
          confirmed: true,
          confirmation: 'REGISTRATION',
          changing_email: null,
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
      await queryInterface.bulkInsert('users_settings', [
        {
          id: 'da334f15-2ce1-4a00-b8cc-6ed9204860d2',
          phone: null,
          phone_code: null,
          code_sent_at: null,
          two_fa_token: 'MNKFQUP6S77VONDE47A3B6VMFEPKVD5X',
          email_changed: false,
          password_changed: null,
          recovery_keys_fingerprint: 'f98987f041451623cccef2992a04f733078640120c7ea00f48e5ca12fe65d74c4bee8a69c248366544784b10a2aafa51efceea1c191a5a9a6878c9e7e44eca46',
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
      await queryInterface.bulkInsert('products', [
        {
          id: '36ec9f36-052a-4fed-91e8-9e588a88b09e',
          title: 'Premium Stainless Steel Cookware Set',
          slug: 'premium-stainless-steel-cookware-set-123123',
          description: 'Upgrade your kitchen with this premium stainless steel cookware set. Crafted with high-quality materials, this set is designed to last a lifetime and elevate your cooking experience.',
          pictures: [
            'premium-stainless-steel-cookware-set-1',
            'premium-stainless-steel-cookware-set-2',
            'premium-stainless-steel-cookware-set-3'
          ],
          location: 'Warsaw',
          currency: 'PLN',
          price: 499.99,
          subcategory: 'kitchen',
          contact_person: 'Ryan Gosling',
          contact_phone: '+48123456789',
          category_id: 'f5ee748e-dca0-47d0-89fd-090b7307c80f',
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'e419dd60-95f6-424b-813f-f593dd354b8d',
          title: 'Stainless Steel Kitchen Knife Set',
          slug: 'stainless-steel-kitchen-knife-set-123123',
          description: 'Upgrade your kitchen arsenal with this high-quality stainless steel knife set. Includes chef\'s knife, bread knife, utility knife, and paring knife.',
          pictures: ['knife-set-image-1'],
          location: 'Rzeszów',
          currency: 'PLN',
          price: 600,
          subcategory: 'kitchen',
          contact_person: 'Jane Smith',
          contact_phone: '+48123456789',
          category_id: 'f5ee748e-dca0-47d0-89fd-090b7307c80f',
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '3d007103-2816-467f-9a6e-d4f29161dbfc',
          title: 'Mountain Bike - Premium Edition',
          slug: 'mountain-bike-premium-edition-123123',
          description: 'Conquer any trail with our premium mountain bike. Built for durability and performance, it features a lightweight frame, responsive suspension, and top-of-the-line components.',
          pictures: ['mountain-bike-premium-edition'],
          location: 'Paris',
          currency: 'EUR',
          price: 1000,
          subcategory: 'cycling',
          contact_person: 'John Doe',
          contact_phone: '+33123456789',
          category_id: 'e434f6ec-ac94-427d-bd05-7a0d07ed5891',
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '8941e111-6565-4efd-9601-54e5a327f936',
          title: 'High-Performance Graphics Card GTX 4080',
          slug: 'high-performance-graphics-card-gtx-4080-123123',
          description: 'Boost your gaming experience with our high-performance graphics card. Designed for hardcore gamers and graphics enthusiasts, it delivers smooth gameplay and stunning visuals.',
          pictures: ['high-performance-graphics-card-gtx-4080'],
          location: 'New York',
          currency: 'USD',
          price: 1250,
          subcategory: 'hardware',
          contact_person: 'Alex Johnson',
          contact_phone: '+1123456789',
          category_id: 'ae8d810e-92b2-4d56-b798-dfe3c0c96158',
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '07c38e77-ba2c-4d5f-9c00-c0feb5917e63',
          title: 'Wireless Gaming Mouse',
          slug: 'wireless-gaming-mouse-123123',
          description: 'Experience freedom and precision with our wireless gaming mouse. With advanced optical sensors and customizable buttons, it\'s perfect for intense gaming sessions.',
          pictures: ['wireless-gaming-mouse'],
          location: 'Los Angeles',
          currency: 'USD',
          price: 79.99,
          subcategory: 'hardware',
          contact_person: 'Sarah Davis',
          contact_phone: '+1987654321',
          category_id: 'ae8d810e-92b2-4d56-b798-dfe3c0c96158',
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '75d11faf-9689-490a-a7a8-e30e55d2ca8f',
          title: 'Mechanical Gaming Keyboard',
          slug: 'mechanical-gaming-keyboard-123123',
          description: 'Dominate your opponents with our mechanical gaming keyboard. Featuring tactile switches and customizable RGB backlighting, it\'s the ultimate weapon for gamers.',
          pictures: [
            'mechanical-gaming-keyboard-1',
            'mechanical-gaming-keyboard-2',
            'mechanical-gaming-keyboard-3'
          ],
          location: 'San Francisco',
          currency: 'USD',
          price: 99.99,
          subcategory: 'hardware',
          contact_person: 'Michael Johnson',
          contact_phone: '+1456789123',
          category_id: 'ae8d810e-92b2-4d56-b798-dfe3c0c96158',
          user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
      await queryInterface.bulkUpdate('users', { favorite_products_ids: [
          'da334f15-2ce1-4a00-b8cc-6ed9204860d2','36ec9f36-052a-4fed-91e8-9e588a88b09e'
        ]
      }, {
        id: 'd6f9d716-008b-4d91-8ae7-072414e6738c'
      });
    } catch (e) {
      console.log(`Error while creating mock data: ${e}`);
    }
  },

  async down(queryInterface) {
    const productIds = [
      '36ec9f36-052a-4fed-91e8-9e588a88b09e',
      'e419dd60-95f6-424b-813f-f593dd354b8d',
      '3d007103-2816-467f-9a6e-d4f29161dbfc',
      '8941e111-6565-4efd-9601-54e5a327f936',
      '07c38e77-ba2c-4d5f-9c00-c0feb5917e63',
      '75d11faf-9689-490a-a7a8-e30e55d2ca8f'
    ];

    await queryInterface.bulkDelete('sessions', { user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c' }, {});
    await queryInterface.bulkDelete('confirmation_hashes', { user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c' }, {});
    await queryInterface.bulkDelete('users_settings', { user_id: 'd6f9d716-008b-4d91-8ae7-072414e6738c' }, {});
    await queryInterface.bulkDelete('users', { id: 'd6f9d716-008b-4d91-8ae7-072414e6738c' }, {});
    await queryInterface.bulkDelete('products', { id: productIds }, {});
  }
};
