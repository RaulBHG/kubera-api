import { CategoryRepositoryContract } from "../domain/contracts/repositories/CategoryRepositoryContract";
import { Category } from "../domain/entities/Category";

export class GetCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepositoryContract
  ) {}

  async get(): Promise<Category[]> {
    return this.categoryRepository.getAll();
  }

  async getVisible(): Promise<Category[]> {
    return this.categoryRepository.getAllVisible();
  }
}
