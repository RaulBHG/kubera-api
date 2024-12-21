import { PlatformRepositoryContract } from "../../domain/contracts/PlatformRepositoryContract";
import { Platform } from "../../domain/entities/Platform";

const PlatformModel = require("../../../models").platform;

export class PlatformSequelizeRepository implements PlatformRepositoryContract {
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
