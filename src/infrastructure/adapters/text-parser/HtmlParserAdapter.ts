import * as cheerio from "cheerio";

export class HtmlParserAdapter {
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

export interface ParsedElement {
  text(): string;
  attr(name: string): string | undefined;
  html(): string | null;
}
