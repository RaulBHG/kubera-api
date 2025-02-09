'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("piggy_bank", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      euro_amount: {
        allowNull: false,
        type: Sequelize.FLOAT,
        validate: {
          max: 200,
        },
      },
      percentage_from_benefits: {
        allowNull: false,
        type: Sequelize.FLOAT,
        validate: {
          max: 100,
        },
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
    await queryInterface.dropTable("piggy_bank");
  }
};