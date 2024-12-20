import { JobContract } from "../../domain/contracts/JobContract";
import { HtmlParserAdapter } from "../../infrastructure/adapters/text-parser/HtmlParserAdapter";
import { ScrapingHttpClientAdapter } from "../../infrastructure/adapters/http/ScrapingHttpClientAdapter";
import { ParsedElement } from "../../domain/contracts/HtmlParserContract";
import { GetCategoryUseCase } from "../GetCategoryUseCase";
import { CategorySequelizeRepository } from "../../infrastructure/repositories/CategorySequelizeRepository";
import { Category } from "../../domain/entities/Category";

import { v4 as uuidv4 } from "uuid";

export class ScrapSteamDbTags implements JobContract {
  private requestMethod: string;
  private requestUrl: string;
  private tlsClientIdentifier: string;
  private headers: Record<string, string>;
  private allTagsSelector: string;
  private tagIdRegexp: RegExp;

  constructor() {
    // Opciones de webscraping
    // Esto hace bypass a CloudFlare en una peticion HTTP (con tls-client-api)
    // usando https://github.com/bogdanfinn/tls-client-api/
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

  getName(): string {
    return "scrape-steamdb-tags-to-categories";
  }

  // TODO: retorno: evitar any
  parseHTML({
    htmlParser,
    htmlData,
  }: {
    htmlParser: HtmlParserAdapter;
    htmlData: string;
  }): any[] {
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

    return data;
  }

  async execute(): Promise<any> {
    try {
      const scrapingClient = new ScrapingHttpClientAdapter();
      const htmlParser = new HtmlParserAdapter();
      let newCategories = [];

      const scrapedResponse = await scrapingClient.enchancedHttpRequest(
        this.requestMethod,
        this.requestUrl,
        this.tlsClientIdentifier,
        this.headers
      );

      if (!scrapedResponse.data || scrapedResponse.data.body === undefined) {
        throw new Error("Invalid response from scraping client");
      }

      const parsedTags = this.parseHTML({
        htmlParser,
        htmlData: scrapedResponse.data.body,
      });

      const categoryRepository = new CategorySequelizeRepository();
      const getAllUseCase = new GetCategoryUseCase(categoryRepository);

      const allCategories = await getAllUseCase.get();

      if (allCategories.length !== parsedTags.length) {
        // TODO: evitar any
        const categoriesMap = allCategories.reduce(
          (acc: any, category: Category) => {
            acc[category.getExternalId()] = category;
            return acc;
          },
          {}
        );

        newCategories = parsedTags.filter((tag) => {
          return !categoriesMap[tag.externalId];
        });

        const newCategoriesPromises = newCategories.map((tag) => {
          return categoryRepository.save(
            new Category(
              uuidv4(),
              tag.name.toLowerCase().replace(" ", "-"),
              tag.name,
              tag.externalId,
              false
            )
          );
        });

        await Promise.all(newCategoriesPromises);
      }

      console.log(
        `[job][ScrapSteamDbTags]: ${parsedTags.length} tags scraped successfully | ${newCategories.length} created`
      );
      return true;
    } catch (error) {
      console.error("Job failed:", error);
      throw error;
    }
  }
}
