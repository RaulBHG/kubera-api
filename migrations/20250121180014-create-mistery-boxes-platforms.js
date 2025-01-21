'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mistery_boxes_platforms", {
      mistery_box_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: "mistery_boxes",
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

    await queryInterface.addConstraint("mistery_boxes_platforms", {
      fields: ["mistery_box_id", "platform_id"],
      type: "unique",
      name: "unique_mistery_box_platform",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('mistery_boxes_platforms');
  }
};