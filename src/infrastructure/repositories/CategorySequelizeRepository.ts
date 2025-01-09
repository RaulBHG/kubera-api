import { CategoryRepositoryContract } from "../../domain/contracts/repositories/CategoryRepositoryContract";
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

  async updateOrCreateByExternalId(
    categories: Category[]
  ): Promise<Category[]> {
    const updatedCategories = await Promise.all(
      categories.map(async (category) => {
        await CategoryModel.update(
          {
            slug: category.getSlug(),
            name: category.getName(),
            visible: category.isVisible(),
          },
          {
            where: {
              external_id: category.getExternalId(),
            },
          }
        );

        const updatedCategory = await CategoryModel.findOne({
          where: {
            external_id: category.getExternalId(),
          },
        });

        if (!updatedCategory) {
          return await CategoryModel.create({
            slug: category.getSlug(),
            name: category.getName(),
            visible: category.isVisible(),
            external_id: category.getExternalId(),
          });
        }

        return updatedCategory;
      })
    );

    return updatedCategories.map(
      (category) =>
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
}
