import { Platform } from "../entities/Platform";

export interface PlatformRepositoryContract {
  getAll(): Promise<Platform[]>;
}
