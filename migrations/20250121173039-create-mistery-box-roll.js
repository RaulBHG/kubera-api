'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mistery_box_rolls", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      mistery_box_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: {
          model: "mistery_boxes", // Table name of the related model
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },
      viewed: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      rejected: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      selected: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      option_number: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('mistery_box_rolls');
  }
};