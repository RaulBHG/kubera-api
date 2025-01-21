'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mistery_boxes_categories", {
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
      category_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });

    // Add a unique constraint to the combination of mistery_box_id and category_id
    await queryInterface.addConstraint("mistery_boxes_categories", {
      fields: ["mistery_box_id", "category_id"],
      type: "unique",
      name: "unique_mistery_box_category",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("mistery_boxes_categories");
  }
};