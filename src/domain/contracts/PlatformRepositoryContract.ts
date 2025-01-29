import { Platform } from "../entities/Platform";

export interface PlatformRepositoryContract {
  getAll(): Promise<Platform[]>;
  getById(id: string): Promise<Platform |null>;
}
