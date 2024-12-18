import { CategoryRepositoryContract } from "../domain/contracts/CategoryRepositoryContract";
import { Category } from "../domain/entities/Category";

export class GetCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepositoryContract) {}

  async getAll(): Promise<Category[]> {
    return this.categoryRepository.getAll();
  }
}
