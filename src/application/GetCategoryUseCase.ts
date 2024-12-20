import { CategoryRepositoryContract } from "../domain/contracts/CategoryRepositoryContract";
import { Category } from "../domain/entities/Category";

export class GetVisibleCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepositoryContract
  ) {}

  async get(): Promise<Category[]> {
    return this.categoryRepository.getAllVisible();
  }
}

export class GetCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepositoryContract
  ) {}

  async get(): Promise<Category[]> {
    return this.categoryRepository.getAll();
  }
}
