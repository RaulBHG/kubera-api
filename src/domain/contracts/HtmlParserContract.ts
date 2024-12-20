export interface ParsedElement {
  text(): string;
  attr(name: string): string | undefined;
  html(): string | null;
}

export interface HTMLParserContract {
  load(html: string): void;
  find(selector: string): ParsedElement[];
  getText(selector: string): string;
  getAttr(selector: string, attr: string): string | undefined;
  getHTML(selector: string): string | null;
}
