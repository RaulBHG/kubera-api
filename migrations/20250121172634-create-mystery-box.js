'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mystery_boxes", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      user_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users", // Table name of the related model
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },
      type_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: {
          model: "mystery_box_types", // Table name of the related model
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },
      expiration: {
        type: "TIMESTAMP",
        allowNull: false,
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
    await queryInterface.dropTable('mystery_boxes');
  }
};