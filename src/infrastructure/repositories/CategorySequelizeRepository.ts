import { CategoryRepositoryContract } from "../../domain/contracts/CategoryRepositoryContract";
import { Category } from "../../domain/entities/Category";

const CategoryModel = require("../../../models").category;

export class CategorySequelizeRepository implements CategoryRepositoryContract {
  async getAll(): Promise<Category[]> {
    const categories = await CategoryModel.findAll();
    return categories.map(
      (category: typeof CategoryModel) =>
        new Category(
          category.id,
          category.slug,
          category.name,
          category.external_id,
          category.visible
        )
    );
  }

  async getAllVisible(): Promise<Category[]> {
    const categories = await CategoryModel.findAll({
      where: {
        visible: true,
      },
    });
    return categories.map(
      (category: typeof CategoryModel) =>
        new Category(
          category.id,
          category.slug,
          category.name,
          category.external_id,
          category.visible
        )
    );
  }

  async save(category: Category): Promise<Category> {
    const createdCategory = await CategoryModel.create({
      slug: category.getSlug(),
      name: category.getName(),
      external_id: category.getExternalId(),
      visible: category.isVisible(),
    });
    return new Category(
      createdCategory.id,
      createdCategory.slug,
      createdCategory.name,
      createdCategory.external_id,
      createdCategory.visible
    );
  }

  async update(category: Category): Promise<Category> {
    const updatedCategory = await CategoryModel.update(
      {
        slug: category.getSlug(),
        name: category.getName(),
        external_id: category.getExternalId(),
        visible: category.isVisible(),
      },
      {
        where: {
          id: category.getId(),
        },
      }
    );
    return new Category(
      updatedCategory.id,
      updatedCategory.slug,
      updatedCategory.name,
      updatedCategory.external_id,
      updatedCategory.visible
    );
  }

  async delete(category: Category): Promise<void> {
    await CategoryModel.destroy({
      where: {
        id: category.getId(),
      },
    });
  }
}
