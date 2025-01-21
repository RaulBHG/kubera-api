'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("piggy_bank_logs", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      transaction_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mistery_box: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: {
          model: "mistery_boxes", // Table name of the related model
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },
      total_euro_ammount: {
        allowNull: false,
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable('piggy_bank_logs');
  }
};