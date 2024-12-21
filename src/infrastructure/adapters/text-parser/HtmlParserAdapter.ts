import * as cheerio from "cheerio";
// import type { CheerioAPI, Cheerio, Element } from "cheerio";
import {
  HTMLParserContract,
  ParsedElement,
  ParsedNode,
} from "../../../domain/contracts/HtmlParserContract";

// Define proper types for the parsed elements
interface ParsedElementImpl extends ParsedElement {
  text(): string;
  attr(name: string): string | undefined;
  html(): string | null;
  parent(): ParsedNode | null;
  prev(): ParsedNode | null;
  next(): ParsedNode | null;
  children(): ParsedNode[];
}

export class HtmlParserAdapter implements HTMLParserContract {
  //@ts-ignore
  private parser: CheerioAPI | null = null;

  load(html: string): void {
    this.parser = cheerio.load(html);
  }

  //@ts-ignore
  private ensureParser(): CheerioAPI {
    if (!this.parser) {
      throw new Error("HTML must be loaded before parsing");
    }
    return this.parser;
  }

  //@ts-ignore
  private createParsedNode(element: Cheerio<Element>): ParsedNode {
    const $ = this.ensureParser();

    return {
      text: () => $(element).text().trim(),
      attr: (name: string) => $(element).attr(name),
      html: () => $(element).html(),
      parent: () => {
        const parent = $(element).parent();
        return parent.length ? this.createParsedNode(parent) : null;
      },
      prev: () => {
        const prev = $(element).prev();
        return prev.length ? this.createParsedNode(prev) : null;
      },
      next: () => {
        const next = $(element).next();
        return next.length ? this.createParsedNode(next) : null;
      },
      children: () =>
        $(element)
          .children()
          .toArray()
          //@ts-ignore
          .map((child) => this.createParsedNode($(child))),
    };
  }

  find(selector: string): ParsedElement[] {
    const $ = this.ensureParser();
    const elements = $(selector);

    return (
      elements
        .toArray()
        //@ts-ignore
        .map((element) => this.createParsedNode($(element)))
    );
  }

  getText(selector: string): string {
    const $ = this.ensureParser();
    return $(selector).text().trim();
  }

  getAttr(selector: string, attr: string): string | undefined {
    const $ = this.ensureParser();
    return $(selector).attr(attr);
  }

  getHTML(selector: string): string | null {
    const $ = this.ensureParser();
    return $(selector).html();
  }
}
