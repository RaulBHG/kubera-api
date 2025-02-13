import { PlatformRepositoryContract } from "../../domain/contracts/PlatformRepositoryContract";
import { Platform } from "../../domain/entities/Platform";

const PlatformModel = require("../../../models").platform;

export class PlatformSequelizeRepository implements PlatformRepositoryContract {
  async getById(id: string): Promise<Platform | null> {
    const platform = await PlatformModel.findByPk(id);
    if (!platform) {
      return null;
    }
    return new Platform(
      platform.id,
      platform.slug,
      platform.name,
      platform.external_id,
      platform.visible
    );
  }
  
  async getAll(): Promise<Platform[]> {
    const platforms = await PlatformModel.findAll({
      where: {
        visible: true,
      },
    });
    return platforms.map(
      (platform: typeof PlatformModel) =>
        new Platform(
          platform.id,
          platform.slug,
          platform.name,
          platform.external_id,
          platform.visible
        )
    );
  }
}
