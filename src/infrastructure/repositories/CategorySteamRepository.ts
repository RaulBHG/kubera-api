import { ExternalCategoryRepositoryContract } from "../../domain/contracts/repositories/ExternalCategoryRepositoryContract";
import { Category } from "../../domain/entities/Category";
import { HtmlParserAdapter } from "../adapters/text-parser/HtmlParserAdapter";
import { ParsedElement } from "../../domain/contracts/HtmlParserContract";
import { ScrapingHttpClientAdapter } from "../adapters/http/ScrapingHttpClientAdapter";

export class CategorySteamRepository
  implements ExternalCategoryRepositoryContract
{
  // Opciones de webscraping
  // Esto hace bypass a CloudFlare en una peticion HTTP (con tls-client-api)
  // usando https://github.com/bogdanfinn/tls-client-api/
  private requestMethod: string;
  private requestUrl: string;
  private tlsClientIdentifier: string;
  private headers: Record<string, string>;

  private allTagsSelector: string;
  private tagIdRegexp: RegExp;

  constructor() {
    this.requestMethod = "GET";
    this.requestUrl = "https://steamdb.info/tags/";
    this.tlsClientIdentifier = "firefox_120";
    this.headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Sec-GPC": "1",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      Priority: "u=1",
    };

    this.allTagsSelector = 'a[class*="tag-color-"]';
    this.tagIdRegexp = /\/tag\/(\d+)/;
  }

  async getAll(): Promise<Category[]> {
    const parseToEntities = ({
      htmlParser,
      htmlData,
    }: {
      htmlParser: HtmlParserAdapter;
      htmlData: string;
    }) => {
      htmlParser.load(htmlData);

      const data = htmlParser
        .find(this.allTagsSelector)
        .map((tag: ParsedElement) => {
          const href = tag.attr("href");
          if (!href) {
            throw new Error("Tag href attribute is missing");
          }

          const match = href.match(this.tagIdRegexp);
          if (!match || !match[1]) {
            throw new Error("Invalid tag URL format");
          }

          const textParts = tag.text().split(" ");
          if (textParts.length < 2) {
            throw new Error("Invalid tag text format");
          }

          return {
            externalId: match[1],
            name: textParts[1],
            icon: textParts[0],
          };
        });

      return data.map(
        (category: { externalId: string; name: string; icon: string }) =>
          new Category(
            "",
            category.name.toLowerCase().replace(" ", "-"),
            category.name,
            category.externalId,
            false
          )
      );
    };

    const scrapingClient = new ScrapingHttpClientAdapter();
    const htmlParser = new HtmlParserAdapter();

    const response = await scrapingClient.enchancedHttpRequest(
      this.requestMethod,
      this.requestUrl,
      this.tlsClientIdentifier,
      this.headers
    );

    if (!response.data || response.data.body === undefined) {
      throw new Error("Invalid response from scraping client");
    }

    return parseToEntities({
      htmlParser,
      htmlData: response.data.body,
    });
  }
}
