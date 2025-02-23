'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mystery_boxes_platforms", {
      mystery_box_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: "mystery_boxes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      platform_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: "platforms",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });

    await queryInterface.addConstraint("mystery_boxes_platforms", {
      fields: ["mystery_box_id", "platform_id"],
      type: "unique",
      name: "unique_mystery_box_platform",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('mystery_boxes_platforms');
  }
};