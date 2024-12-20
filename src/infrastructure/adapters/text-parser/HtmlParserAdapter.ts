import * as cheerio from "cheerio";
import {
  HTMLParserContract,
  ParsedElement,
} from "../../../domain/contracts/HtmlParserContract";

export class HtmlParserAdapter implements HTMLParserContract {
  private $: any; // TODO: evitar any

  load(html: string): void {
    this.$ = cheerio.load(html);
  }

  find(selector: string): ParsedElement[] {
    const elements = this.$(selector);
    // TODO: evitar any
    return elements.toArray().map((element: any) => ({
      text: () => this.$(element).text().trim(),
      attr: (name: string) => this.$(element).attr(name),
      html: () => this.$(element).html(),
    }));
  }

  getText(selector: string): string {
    return this.$(selector).text().trim();
  }

  getAttr(selector: string, attr: string): string | undefined {
    return this.$(selector).attr(attr);
  }

  getHTML(selector: string): string | null {
    return this.$(selector).html();
  }
}
