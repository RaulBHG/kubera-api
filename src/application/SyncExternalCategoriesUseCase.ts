import { CategoryRepositoryContract } from "../domain/contracts/repositories/CategoryRepositoryContract";
import { ExternalCategoryRepositoryContract } from "../domain/contracts/repositories/ExternalCategoryRepositoryContract";

export class SyncExternalCategoriesUseCase {
  constructor(
    private categoryRepository: CategoryRepositoryContract,
    private externalCategoryRepository: ExternalCategoryRepositoryContract
  ) {}

  async execute(): Promise<void> {
    try {
      const externalCategories = await this.externalCategoryRepository.getAll();

      const affectedRecords =
        await this.categoryRepository.updateOrCreateByExternalId(
          externalCategories
        );

      console.log(`${affectedRecords.length} record(s) affected.`);
    } catch (error) {
      console.error("job failed:", error);
      throw error;
    }
  }
}
