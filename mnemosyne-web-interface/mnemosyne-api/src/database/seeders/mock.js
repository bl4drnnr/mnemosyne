/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, sequelize) {
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

      // User hash: 71956c9eea017cb85242a49f416fd859
      await queryInterface.bulkInsert('users', [
        {
          id: 'd6f9d716-008b-4d91-8ae7-072414e6738c',
          email: 'ryan.gosling@drive.com',
          // Password: 12qw!@QW
          password: '$2a$10$1HvnaYFhmlKAT/kmpA2rDOu3jSXqzRoBsbeFUrHLQoqKQgl8lsUba',
          first_name: 'Ryan',
          last_name: 'Gosling',
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
          pictures: ['knife-set-image-1', 'knife-set-image-2', 'knife-set-image-3'],
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
          pictures: ['mountain-bike-premium-edition-1', 'mountain-bike-premium-edition-2'],
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
          pictures: ['wireless-gaming-mouse-1', 'wireless-gaming-mouse-2', 'wireless-gaming-mouse-3'],
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

      await queryInterface.bulkUpdate('users', {
        favorite_products_ids: [
          'da334f15-2ce1-4a00-b8cc-6ed9204860d2',
          '36ec9f36-052a-4fed-91e8-9e588a88b09e'
        ]
      }, {
        id: 'd6f9d716-008b-4d91-8ae7-072414e6738c'
      });

      await queryInterface.bulkInsert('users', [
        // User hash: a6eb66d06f8c7351f69d125197e21af9
        {
          id: 'f47115d1-5a88-40f8-ad06-aed56f5b470d',
          email: 'jan.kowalski@mnemosyne.io',
          // Password: 12qw!@QW
          password: '$2a$10$52OIK8LCqhfXRXvGlWI8Pe1SSkMASgifcMTDgm1xt1VQje/Qu3S3e',
          first_name: 'Jan',
          last_name: 'Kowalski',
          home_address: '123 Main Street, Cityville, Country',
          home_phone: '+1234567890',
          is_mfa_set: true,
          tac: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        // User hash: ba31d7c3e8f226294f2e014c3850c481
        {
          id: '9bb5010e-1a6b-48ed-b9d1-38f3299720a3',
          email: 'ivan.ivanov@mnemosyne.io',
          // Password: 12qw!@QW
          password: '$2a$10$9C28xRj8vZnMftjYLfmkI.V22kOj5V3K/.W0a1heMGSPv/TosxbWK',
          first_name: 'Ivan',
          last_name: 'Ivanov',
          home_address: '456 Elm Street, Townsville, Country',
          home_phone: '+9876543210',
          is_mfa_set: true,
          tac: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        // User hash: 7bffe186f07885e46e548b02356006e6
        {
          id: '61b39780-f4ef-4093-a800-de3ff7475f72',
          email: 'john.doe@mnemosyne.io',
          // Password: 12qw!@QW
          password: '$2a$10$ey6fBmb38fxFk8yBRzM8MumOT5P26fPiNpFWXvy.y1to6kDofER3K',
          first_name: 'John',
          last_name: 'Doe',
          home_address: '789 Oak Street, Villagetown, Country',
          home_phone: '+1122334455',
          is_mfa_set: true,
          tac: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        // User hash: c2f5d35aa190fdb952c79f467a0176bb.png
        {
          id: 'ec9ed01a-89bc-4b8c-95af-ce05e01fb8e6',
          email: 'ewa.nowak@mnemosyne.io',
          // Password: 12qw!@QW
          password: '$2a$10$vh/gTuAucF26u1W8zABXaezV85wEUT/oRfvMXjLgGcrdupg.o582S',
          first_name: 'Ewa',
          last_name: 'Nowak',
          home_address: '321 Pine Street, Hamletville, Country',
          home_phone: '+9988776655',
          is_mfa_set: true,
          tac: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      await queryInterface.bulkInsert('confirmation_hashes', [
        {
          id: 'faf6e081-906a-4731-8bf9-145c690217c5',
          confirmation_hash: '55ead7995189c933a9d20f34f439e717dc8d4cb2',
          confirmed: true,
          confirmation: 'REGISTRATION',
          changing_email: null,
          user_id: 'f47115d1-5a88-40f8-ad06-aed56f5b470d',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'f9ffe1db-48de-4faa-bd70-d1d7828623e4',
          confirmation_hash: '55ead7995189c933a9d20f34f439e717dc8d4cb2',
          confirmed: true,
          confirmation: 'COMPANY_REGISTRATION',
          changing_email: null,
          user_id: 'f47115d1-5a88-40f8-ad06-aed56f5b470d',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'd493d02e-d9ad-4fb4-bcdb-5be98f4130d1',
          confirmation_hash: '805997729c45addd7f9f07b421f4d1445dc6a682',
          confirmed: true,
          confirmation: 'REGISTRATION',
          changing_email: null,
          user_id: 'ec9ed01a-89bc-4b8c-95af-ce05e01fb8e6',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'e4b6d9ee-ae9d-4f96-9d5a-2dced0832a81',
          confirmation_hash: '805997729c45addd7f9f07b421f4d1445dc6a682',
          confirmed: true,
          confirmation: 'COMPANY_INVITATION',
          changing_email: null,
          user_id: 'ec9ed01a-89bc-4b8c-95af-ce05e01fb8e6',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '853456b1-6566-47c6-999e-cb3ebef24e0a',
          confirmation_hash: '5b6d3eb15316f30d684033b81f1366ba0f954569',
          confirmed: true,
          confirmation: 'REGISTRATION',
          changing_email: null,
          user_id: '61b39780-f4ef-4093-a800-de3ff7475f72',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'e64b73ec-1984-4676-9178-7ddf91824d7b',
          confirmation_hash: '5b6d3eb15316f30d684033b81f1366ba0f954569',
          confirmed: true,
          confirmation: 'COMPANY_INVITATION',
          changing_email: null,
          user_id: '61b39780-f4ef-4093-a800-de3ff7475f72',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '5d256051-c56e-43e2-9ee1-5db9d53178e7',
          confirmation_hash: '85ab6312c92cbb054fad5b96aeb993d46c3bfbb6',
          confirmed: true,
          confirmation: 'REGISTRATION',
          changing_email: null,
          user_id: '9bb5010e-1a6b-48ed-b9d1-38f3299720a3',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '6b37f85a-7472-45cb-85d4-293875d48bf5',
          confirmation_hash: '85ab6312c92cbb054fad5b96aeb993d46c3bfbb6',
          confirmed: true,
          confirmation: 'COMPANY_INVITATION',
          changing_email: null,
          user_id: '9bb5010e-1a6b-48ed-b9d1-38f3299720a3',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      await queryInterface.bulkInsert('users_settings', [
        {
          id: '569326b4-3120-4b06-807c-41beeb6feeba',
          phone: null,
          phone_code: null,
          code_sent_at: null,
          two_fa_token: 'QD4QRWCYQCBA65YTZ7ZFJ54LSBAIHOHL',
          email_changed: false,
          password_changed: null,
          recovery_keys_fingerprint: 'f98987f041451623cccef2992a04f733078640120c7ea00f48e5ca12fe65d74c4bee8a69c248366544784b10a2aafa51efceea1c191a5a9a6878c9e7e44eca46',
          user_id: 'f47115d1-5a88-40f8-ad06-aed56f5b470d',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '1fda175d-bf41-47b8-9373-1ffc51e96104',
          phone: null,
          phone_code: null,
          code_sent_at: null,
          two_fa_token: 'CLOBNI2DCBWMZQJOBX7GOMHOED7S7XO4',
          email_changed: false,
          password_changed: null,
          recovery_keys_fingerprint: '1696d07e35163753326c4b4893bc66851c5f9ccd7541adbd726adb5ea71c6a233f65e70e00a78e80e46c760c41a63b76e39683040dbf3a781774c13569c1a9f5',
          user_id: 'ec9ed01a-89bc-4b8c-95af-ce05e01fb8e6',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '721c71ec-cedd-4a1d-8dad-d69dfa70be68',
          phone: null,
          phone_code: null,
          code_sent_at: null,
          two_fa_token: 'XFOWKWBARJ3CRIKXMZZKB7HV7VQMWF54',
          email_changed: false,
          password_changed: null,
          recovery_keys_fingerprint: 'a3b64d6b5324adb5a14ee6a762b9b60f92c290a2ab840aef9de2efee33b4dcf8aa1b7f26bf82f9f99e600fed02d4fb5d73f2cd7c787fac6d1cef20613307a8b1',
          user_id: '61b39780-f4ef-4093-a800-de3ff7475f72',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'e0842ceb-e2e8-4349-8847-ca5a416ae9d0',
          phone: null,
          phone_code: null,
          code_sent_at: null,
          two_fa_token: 'HFZ462Y4JNF7YZBXMBQ5SLGZCKWAYWH7',
          email_changed: false,
          password_changed: null,
          recovery_keys_fingerprint: 'bfee99e32ef795d01ad39903b40afde79c77723f174751143bd47354e5d7ba5b7299ebb85c7e17f806e4164b4ba52fe45bf5abf9f6590ed083cbca4fea0fbdf4',
          user_id: '9bb5010e-1a6b-48ed-b9d1-38f3299720a3',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      await queryInterface.bulkInsert('companies', [
        {
          id: '882d9da3-b892-485d-9146-69fe00564d79',
          company_name: 'Mnemosyne',
          company_location: 'Rzeszów, Sucharskiego 2',
          company_website: 'mnemosyne.io',
          company_owner_id: 'f47115d1-5a88-40f8-ad06-aed56f5b470d',
          is_confirmed: true,
          tac: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      await queryInterface.bulkInsert('company_users', [
        {
          id: 'd60c4556-7943-4fd0-aade-d30afa9b6d7b',
          user_id: 'f47115d1-5a88-40f8-ad06-aed56f5b470d',
          company_id: '882d9da3-b892-485d-9146-69fe00564d79',
          invitation_confirmed: true,
          invitation_sent_at: new Date('2024-04-11T14:40:31.333Z'),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'a3784963-8ead-4c5c-bc40-9c6a80ba84fe',
          user_id: 'ec9ed01a-89bc-4b8c-95af-ce05e01fb8e6',
          company_id: '882d9da3-b892-485d-9146-69fe00564d79',
          invitation_confirmed: true,
          invitation_sent_at: new Date('2024-04-11T14:40:32.940Z'),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'ff68da57-409d-401b-b0cd-83104388c93b',
          user_id: '61b39780-f4ef-4093-a800-de3ff7475f72',
          company_id: '882d9da3-b892-485d-9146-69fe00564d79',
          invitation_confirmed: true,
          invitation_sent_at: new Date('2024-04-11T14:40:31.371Z'),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '748a08a8-5b8d-4acf-acdf-faa5848649b0',
          user_id: '9bb5010e-1a6b-48ed-b9d1-38f3299720a3',
          company_id: '882d9da3-b892-485d-9146-69fe00564d79',
          invitation_confirmed: true,
          invitation_sent_at: new Date('2024-04-11T14:40:32.690Z'),
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      await queryInterface.bulkInsert('roles', [
        {
          id: 'a22a59b8-0e54-4fd1-a30b-a23d010f164c',
          name: 'PRIMARY_ADMIN',
          description: 'primary_admin_desc',
          role_scopes: sequelize.literal(`ARRAY['USER_MANAGEMENT', 'ROLES_MANAGEMENT', 'COMPANY_INFORMATION_MANAGEMENT', 'PRODUCT_MANAGEMENT']::"enum_roles_role_scopes"[]`),
          created_at: new Date('2024-04-11T14:40:31.344Z'),
          updated_at: new Date('2024-04-11T14:40:31.344Z')
        },
        {
          id: 'a6e0d8f3-a1a8-4110-8f29-36f2eed49287',
          name: 'DEFAULT',
          description: 'default_desc',
          role_scopes: sequelize.literal(`ARRAY[]::"enum_roles_role_scopes"[]`),
          created_at: new Date('2024-04-11T14:40:31.354Z'),
          updated_at: new Date('2024-04-11T14:40:31.354Z')
        },
        {
          id: '20d03287-5743-48d8-8c1b-c17eac47de0b',
          name: 'DEFAULT',
          description: 'default_desc',
          role_scopes: sequelize.literal(`ARRAY[]::"enum_roles_role_scopes"[]`),
          created_at: new Date('2024-04-11T14:40:31.378Z'),
          updated_at: new Date('2024-04-11T14:40:31.378Z')
        },
        {
          id: '2c4bc11c-51eb-44d4-be70-af0992be5502',
          name: 'DEFAULT',
          description: 'default_desc',
          role_scopes: sequelize.literal(`ARRAY[]::"enum_roles_role_scopes"[]`),
          created_at: new Date('2024-04-11T14:40:32.696Z'),
          updated_at: new Date('2024-04-11T14:40:32.696Z')
        },
        {
          id: 'ef49db6d-3979-4a22-94ae-20f3e052f39a',
          name: 'DEFAULT',
          description: 'default_desc',
          role_scopes: sequelize.literal(`ARRAY[]::"enum_roles_role_scopes"[]`),
          created_at: new Date('2024-04-11T14:40:32.945Z'),
          updated_at: new Date('2024-04-11T14:40:32.945Z')
        },
        {
          id: 'fa0992ec-09fe-4aa2-a291-f30babcfaf84',
          name: 'Product Mgmt',
          description: 'The role for product manager',
          role_scopes: sequelize.literal(`ARRAY['COMPANY_INFORMATION_MANAGEMENT', 'PRODUCT_MANAGEMENT']::"enum_roles_role_scopes"[]`),
          created_at: new Date('2024-04-11T14:50:45.492Z'),
          updated_at: new Date('2024-04-11T14:51:55.691Z')
        },
        {
          id: 'b4cd6205-00f4-4524-926b-2fbca5d4b588',
          name: 'Security',
          description: 'Security team manages roles',
          role_scopes: sequelize.literal(`ARRAY['USER_MANAGEMENT', 'ROLES_MANAGEMENT']::"enum_roles_role_scopes"[]`),
          created_at: new Date('2024-04-11T14:51:17.441Z'),
          updated_at: new Date('2024-04-11T14:51:59.445Z')
        }
      ]);

      await queryInterface.bulkInsert('users_roles', [
        {
          id: '6f72aa2c-dd73-4437-9fb6-dccc7f779453',
          company_user_id: 'd60c4556-7943-4fd0-aade-d30afa9b6d7b',
          company_id: '882d9da3-b892-485d-9146-69fe00564d79',
          role_id: 'a22a59b8-0e54-4fd1-a30b-a23d010f164c',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '0334d825-024e-47bb-8b1e-e0345a004da6',
          company_user_id: 'd60c4556-7943-4fd0-aade-d30afa9b6d7b',
          company_id: '882d9da3-b892-485d-9146-69fe00564d79',
          role_id: 'a6e0d8f3-a1a8-4110-8f29-36f2eed49287',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '1febe68d-6191-4346-9279-55b11dccea5c',
          company_user_id: 'ff68da57-409d-401b-b0cd-83104388c93b',
          company_id: '882d9da3-b892-485d-9146-69fe00564d79',
          role_id: '20d03287-5743-48d8-8c1b-c17eac47de0b',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '600589fb-46d3-40b8-894d-9367d2bf3100',
          company_user_id: '748a08a8-5b8d-4acf-acdf-faa5848649b0',
          company_id: '882d9da3-b892-485d-9146-69fe00564d79',
          role_id: 'fa0992ec-09fe-4aa2-a291-f30babcfaf84',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'b0256bfc-ffc5-43bf-9b8a-99cfb2183003',
          company_user_id: 'a3784963-8ead-4c5c-bc40-9c6a80ba84fe',
          company_id: '882d9da3-b892-485d-9146-69fe00564d79',
          role_id: 'b4cd6205-00f4-4524-926b-2fbca5d4b588',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      await queryInterface.bulkInsert('products', [
        {
          id: 'dd08b14a-0046-412e-8a9e-c32547a15774',
          title: 'AirPods Pro Gen. 2',
          slug: 'airpods-pro-gen-2-808508',
          description: 'Introducing AirPods Pro 2, the next evolution in wireless audio technology. With enhanced active noise cancellation and immersive spatial audio, experience crystal-clear sound in any environment. Sleek and comfortable, these earbuds redefine your listening experience with effortless connectivity and customizable fit.',
          pictures: ['airpods-pro-1', 'airpods-pro-2', 'airpods-pro-3'],
          location: 'Rzeszów',
          currency: 'PLN',
          price: 1500,
          subcategory: 'hardware',
          contact_person: 'Jan Kowalski',
          contact_phone: '1123123123',
          on_behalf_of_company: true,
          category_id: 'ae8d810e-92b2-4d56-b798-dfe3c0c96158',
          user_id: 'f47115d1-5a88-40f8-ad06-aed56f5b470d',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '2f87637b-4239-4346-8b4a-0eb50c29936c',
          title: 'GTX 4080 Graphic Card',
          slug: 'gtx-4080-graphic-card-312188',
          description: 'Introducing the GTX 4080, the pinnacle of graphics card innovation. Engineered for unparalleled gaming performance and stunning visual fidelity, this powerhouse GPU redefines the boundaries of immersive gaming experiences. With advanced ray tracing capabilities and lightning-fast rendering, dive into lifelike worlds with unprecedented realism and fluidity.',
          pictures: ['high-performance-graphics-card-gtx-4080'],
          location: 'Rzeszów',
          currency: 'PLN',
          price: 4000,
          subcategory: 'hardware',
          contact_person: 'Jan Kowalski',
          contact_phone: '1123123123',
          on_behalf_of_company: true,
          category_id: 'ae8d810e-92b2-4d56-b798-dfe3c0c96158',
          user_id: 'f47115d1-5a88-40f8-ad06-aed56f5b470d',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '46945634-9a5b-4281-ac06-1b0165a9e16e',
          title: 'New Fancy iPhone 14 Pro',
          slug: 'new-fancy-iphone-14-pro-832080',
          description: 'Introducing the iPhone 14, the next generation of Apple\'s iconic smartphone series. With cutting-edge technology and sleek design, the iPhone 14 delivers unrivaled performance and seamless user experience. From its stunning Super Retina XDR display to its powerful A-series chip, every detail is crafted to elevate your daily tasks and inspire creativity.',
          pictures: ['iphone-14-1', 'iphone-14-2'],
          location: 'California',
          currency: 'USD',
          price: 1499,
          subcategory: 'hardware',
          contact_person: 'Jan Kowalski',
          contact_phone: '1123123123',
          on_behalf_of_company: true,
          category_id: 'ae8d810e-92b2-4d56-b798-dfe3c0c96158',
          user_id: 'f47115d1-5a88-40f8-ad06-aed56f5b470d',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '5f3e4865-5df0-4ace-925e-c317321525dd',
          title: 'Gaming / Office Chair',
          slug: 'gaming--office-chair-755340',
          description: 'Introducing our gaming office chair, designed for the ultimate comfort and support during long gaming sessions or intense work hours. Featuring ergonomic design, lumbar support, and adjustable armrests, it ensures optimal posture and reduces fatigue. With premium materials and stylish aesthetics, elevate your gaming or workspace with both comfort and style.',
          pictures: ['chair-1', 'chair-2', 'chair-3'],
          location: 'Warsaw',
          currency: 'PLN',
          price: 999,
          subcategory: 'bedroom',
          contact_person: 'Jan Kowalski',
          contact_phone: '1123123123',
          on_behalf_of_company: false,
          category_id: 'f5ee748e-dca0-47d0-89fd-090b7307c80f',
          user_id: 'f47115d1-5a88-40f8-ad06-aed56f5b470d',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '51aac178-bf9b-4739-bae8-0458b51ca33a',
          title: 'Funko Pop Harry Potter Collection Figures',
          slug: 'funko-pop-harry-potter-collection-figures-075632',
          description: 'Introducing our Funko Pop collectible, the perfect addition to any pop culture enthusiast\'s collection. With meticulously crafted details and vibrant colors, each Funko Pop figure captures the essence of beloved characters from movies, TV shows, and games. Display them proudly on your shelf or desk and let your fandom shine.',
          pictures: ['funko-pop-1', 'funko-pop-2', 'funko-pop-3'],
          location: 'Paris',
          currency: 'EUR',
          price: 15,
          subcategory: 'decoration',
          contact_person: 'Jan Kowalski',
          contact_phone: '1123123123',
          on_behalf_of_company: false,
          category_id: 'f5ee748e-dca0-47d0-89fd-090b7307c80f',
          user_id: 'f47115d1-5a88-40f8-ad06-aed56f5b470d',
          created_at: new Date('2024-04-12T07:25:12.808Z'),
          updated_at: new Date('2024-04-12T07:25:12.808Z')
        },
        {
          id: '8de4f4ba-bd7d-496c-9f6f-3b2f26ac497f',
          title: 'Apple Mac Book Pro 14\'\'',
          slug: 'apple-mac-book-pro-14-273002',
          description: 'Introducing the MacBook Pro, the epitome of power and elegance in portable computing. With blazing-fast performance, stunning Retina display, and all-day battery life, it\'s the ultimate tool for creativity and productivity on the go. Whether you\'re editing videos, coding, or designing graphics, the MacBook Pro delivers unparalleled performance and reliability to bring your ideas to life.',
          pictures: ['macbook-pro-1', 'macbook-pro-2', 'macbook-pro-3'],
          location: 'New York',
          currency: 'USD',
          price: 1500,
          subcategory: 'hardware',
          contact_person: 'Jan Kowalski',
          contact_phone: '1112312313',
          on_behalf_of_company: true,
          category_id: 'ae8d810e-92b2-4d56-b798-dfe3c0c96158',
          user_id: 'f47115d1-5a88-40f8-ad06-aed56f5b470d',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '2c75678e-aee7-4aff-911d-ab6aa2a06fc2',
          title: 'Mechanical Gaming Keyboard',
          slug: 'mechanical-gaming-keyboard-265134',
          description: 'Introducing our mechanical gaming keyboard, meticulously engineered for precision and durability in every keystroke. With customizable RGB lighting, tactile switches, and anti-ghosting technology, it offers a responsive and immersive gaming experience. Elevate your gameplay and dominate the competition with this essential tool for serious gamers.',
          pictures: ['mechanical-gaming-keyboard-1', 'mechanical-gaming-keyboard-2', 'mechanical-gaming-keyboard-3'],
          location: 'Florence',
          currency: 'EUR',
          price: 100,
          subcategory: 'hardware',
          contact_person: 'Ewa Nowak',
          contact_phone: '1432432423',
          on_behalf_of_company: false,
          category_id: 'ae8d810e-92b2-4d56-b798-dfe3c0c96158',
          user_id: 'ec9ed01a-89bc-4b8c-95af-ce05e01fb8e6',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '2cf1612f-eb1f-4790-9bb9-5f74d984ba85',
          title: 'Super Gaming Monitor',
          slug: 'super-gaming-monitor-651414',
          description: 'Introducing our gaming monitor, designed to deliver the ultimate gaming experience with stunning visuals and fluid performance. Featuring a high refresh rate, low response time, and immersive resolution, it ensures smooth gameplay and crisp graphics in every frame. Whether you\'re diving into intense battles or exploring vast worlds, this monitor offers the competitive edge you need to excel in gaming.',
          pictures: ['monitor-1', 'monitor-2', 'monitor-3'],
          location: 'New York',
          currency: 'USD',
          price: 100,
          subcategory: 'hardware',
          contact_person: 'Ivan Ivanov',
          contact_phone: '1999666999',
          on_behalf_of_company: true,
          category_id: 'ae8d810e-92b2-4d56-b798-dfe3c0c96158',
          user_id: '9bb5010e-1a6b-48ed-b9d1-38f3299720a3',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '04232fb5-cda5-4e54-afff-d4e81217a21d',
          title: 'Nintendo Switch Gaming Console',
          slug: 'nintendo-switch-gaming-console-285910',
          description: 'Introducing the Nintendo Switch, a revolutionary gaming console that seamlessly transitions between handheld and home modes. With its versatile design and extensive game library, it offers endless entertainment for players of all ages. Whether you\'re at home or on the go, the Nintendo Switch delivers immersive gaming experiences that redefine portable gaming.',
          pictures: ['nintendo-switch'],
          location: 'New York',
          currency: 'USD',
          price: 100,
          subcategory: 'hardware',
          contact_person: 'Ivan Ivanov',
          contact_phone: '1666999666',
          on_behalf_of_company: true,
          category_id: 'ae8d810e-92b2-4d56-b798-dfe3c0c96158',
          user_id: '9bb5010e-1a6b-48ed-b9d1-38f3299720a3',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '18dd2fa9-7ef3-4f69-b3b1-0fb04a47dc7f',
          title: 'PlayStation 4 Pro',
          slug: 'playstation-4-pro-469144',
          description: 'Introducing the PS4 Pro, the ultimate gaming console designed for immersive entertainment experiences. With enhanced graphics, powerful performance, and 4K resolution capabilities, it delivers breathtaking visuals and smooth gameplay. Whether you\'re diving into blockbuster games or streaming your favorite movies and shows, the PS4 Pro offers unparalleled gaming and entertainment in the comfort of your home.',
          pictures: ['ps4-pro-1', 'ps4-pro-2', 'ps4-pro-3'],
          location: 'New York',
          currency: 'USD',
          price: 499,
          subcategory: 'hardware',
          contact_person: 'Ivan Ivanov',
          contact_phone: '1666999666',
          on_behalf_of_company: true,
          category_id: 'ae8d810e-92b2-4d56-b798-dfe3c0c96158',
          user_id: '9bb5010e-1a6b-48ed-b9d1-38f3299720a3',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '03be505c-d6b6-499f-9925-a2e07495c1ff',
          title: 'Vinyl, the timeless medium for music lovers',
          slug: 'vinyl-the-timeless-medium-for-music-lovers-065430',
          description: 'Introducing vinyl, the timeless medium for music lovers and collectors alike. With its warm sound and nostalgic charm, vinyl records offer a unique listening experience that transcends generations. From classic albums to contemporary releases, vinyl brings your favorite music to life with rich tones and tactile enjoyment, making it a cherished addition to any audiophile\'s collection.',
          pictures: ['vinil-1', 'vinil-2', 'vinil-3'],
          location: 'New York',
          currency: 'USD',
          price: 100,
          subcategory: 'decoration',
          contact_person: 'Ivan Ivanov',
          contact_phone: '1666999666',
          on_behalf_of_company: false,
          category_id: 'f5ee748e-dca0-47d0-89fd-090b7307c80f',
          user_id: '9bb5010e-1a6b-48ed-b9d1-38f3299720a3',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '78f729be-7f29-4676-88ee-d61f41cdd20f',
          title: 'SteelSeries Gaming Mouse',
          slug: 'steelseries-gaming-mouse-993184',
          description: 'Introducing our wireless gaming mouse, engineered for precision and performance in every click. With advanced sensors and customizable buttons, it offers seamless control and responsiveness for intense gaming sessions. Free from tangled wires, this ergonomic mouse provides freedom of movement, while its sleek design and RGB lighting add flair to your gaming setup. Dominate the competition and elevate your gameplay with our wireless gaming mouse.',
          pictures: ['wireless-gaming-mouse-1', 'wireless-gaming-mouse-2', 'wireless-gaming-mouse-3'],
          location: 'Florida',
          currency: 'USD',
          price: 199,
          subcategory: 'hardware',
          contact_person: 'Ivan Ivanov',
          contact_phone: '1666666999',
          on_behalf_of_company: false,
          category_id: 'ae8d810e-92b2-4d56-b798-dfe3c0c96158',
          user_id: '9bb5010e-1a6b-48ed-b9d1-38f3299720a3',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '78f729be-7f29-4676-88ee-d61f41cdd201',
          title: 'Books for all programmers and codes',
          slug: 'books-for-all-programmers-and-codes-123123',
          description: 'Embark on a journey of knowledge and discovery with our comprehensive collection of IT books. From programming languages to cybersecurity, cloud computing to artificial intelligence, our curated selection covers a wide range of topics essential for both beginners and experts in the field. Dive into the latest trends, explore cutting-edge technologies, and master the skills needed to excel in today\'s fast-paced digital landscape. Whether you\'re a seasoned professional seeking to stay ahead of the curve or a curious enthusiast eager to delve into the world of technology, our IT books provide invaluable insights and practical guidance to help you thrive in the ever-evolving realm of information technology.',
          pictures: ['it-books-1', 'it-books-2', 'it-books-3'],
          location: 'Florida',
          currency: 'USD',
          price: 36,
          subcategory: 'it_books',
          contact_person: 'Ivan Ivanov',
          contact_phone: '1666666999',
          on_behalf_of_company: false,
          category_id: 'ae8d810e-92b2-4d56-b798-dfe3c0c96158',
          user_id: '9bb5010e-1a6b-48ed-b9d1-38f3299720a3',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
    } catch (e) {
      console.log(`Error while creating mock data: ${e}`);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});

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
