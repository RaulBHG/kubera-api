'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mystery_boxes_categories", {
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

    // Add a unique constraint to the combination of mystery_box_id and category_id
    await queryInterface.addConstraint("mystery_boxes_categories", {
      fields: ["mystery_box_id", "category_id"],
      type: "unique",
      name: "unique_mystery_box_category",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("mystery_boxes_categories");
  }
};