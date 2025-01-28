'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("game_provider_games", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      mystery_box_roll_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: {
          model: "mistery_box_rolls", // Table name of the related model
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },
      platform_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: {
          model: "platforms", // Table name of the related model
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },
      game_provider: {
        type: Sequelize.ENUM,
        values: ["kinguin"],
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      region: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      img_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      external_data: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('game_provider_games');
  }
};