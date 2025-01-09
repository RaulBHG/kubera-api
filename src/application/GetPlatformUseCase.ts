import { PlatformRepositoryContract } from "../domain/contracts/PlatformRepositoryContract";
import { Platform } from "../domain/entities/Platform";

export class GetPlatformUseCase {
  constructor(
    private readonly platformRepository: PlatformRepositoryContract
  ) {}

  async getAll(): Promise<Platform[]> {
    return this.platformRepository.getAll();
  }
}
