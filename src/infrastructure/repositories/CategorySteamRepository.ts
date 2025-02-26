import { ExternalCategoryRepositoryContract } from "../../domain/contracts/ExternalCategoryRepositoryContract";
import { Category } from "../../domain/entities/Category";
import { HttpClientAdapter } from "../adapters/http/HttpClientAdapter";

export class CategorySteamRepository
  implements ExternalCategoryRepositoryContract
{
  private requestMethod: string;
  private requestUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.requestMethod = "GET";
    this.requestUrl = `${process.env.STEAM_API_URL}/IStoreService/GetTagList/v1/?key=${process.env.STEAM_API_KEY}&language=english`;
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  async getAll(): Promise<Category[]> {
    const parseToEntities = (jsonData: any[]) => {
      return jsonData.map((item: { tagid: string; name: string }) => {
        return new Category(
          "",
          item.name.toLowerCase().replace(" ", "-"),
          item.name,
          Number(item.tagid),
          false
        );
      });
    };

    const client = new HttpClientAdapter();

    const steamResponse = await client.httpRequest(
      this.requestMethod,
      this.requestUrl,
      this.headers
    );

    if (!steamResponse || !steamResponse.response.tags) {
      throw new Error("No categories found in steam response");
    }

    return parseToEntities(steamResponse.response.tags);
  }
}
