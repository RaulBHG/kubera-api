import { GetCategoryUseCase } from "../../application/GetCategoryUseCase";
import { Category } from "../../domain/entities/Category";
import { CategorySequelizeRepository } from "../repositories/CategorySequelizeRepository";
import { Response } from "express";

export class CategoryController {
  async getAll(res: Response): Promise<void> {
    try {
      const getCategoryUseCase = new GetCategoryUseCase(
        new CategorySequelizeRepository()
      );
      const categories = await getCategoryUseCase.getAll();
      const categoriesWithoutExternalId = categories.map(
        (category: Category) => ({
          id: category.getId(),
          slug: category.getSlug(),
          name: category.getName(),
        })
      );

      res.status(200).json({
        success: true,
        data: categoriesWithoutExternalId,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching categories",
      });
    }
  }
}