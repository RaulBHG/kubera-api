import { CategoryRepositoryContract } from "../domain/contracts/repositories/CategoryRepositoryContract";
import { ExternalCategoryRepositoryContract } from "../domain/contracts/repositories/ExternalCategoryRepositoryContract";
import { LoggerContract } from "../domain/contracts/LoggerContract";
import { LogLevel } from "../domain/value-objects/LogLevel";

export class SyncExternalCategoriesUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepositoryContract,
    private readonly externalCategoryRepository: ExternalCategoryRepositoryContract,
    private readonly logger: LoggerContract
  ) {}

  async execute(): Promise<void> {
    try {
      const externalCategories = await this.externalCategoryRepository.getAll();

      const affectedRecords =
        await this.categoryRepository.updateOrCreateByExternalId(
          externalCategories
        );

      await this.logger.log("Categories synchronization completed", {
        context: "SyncExternalCategoriesUseCase",
        attributes: {
          status: "success",
          affectedRecords: affectedRecords.length,
        },
      });
    } catch (error) {
      await this.logger.log("Categories synchronization failed", {
        level: LogLevel.FATAL,
        context: "SyncExternalCategoriesUseCase",
        attributes: {
          status: "failed",
          error:
            error instanceof Error
              ? {
                  message: error.message,
                  stack: error.stack,
                }
              : String(error),
        },
      });
      throw error;
    }
  }
}
