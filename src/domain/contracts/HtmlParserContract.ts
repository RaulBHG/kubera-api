export interface ParsedNode {
  text(): string;
  attr(name: string): string | undefined;
  html(): string | null;
  parent(): ParsedNode | null;
  prev(): ParsedNode | null;
  next(): ParsedNode | null;
  children(): ParsedNode[];
}

export interface ParsedElement extends ParsedNode {}

export interface HTMLParserContract {
  load(html: string): void;
  find(selector: string): ParsedElement[];
  getText(selector: string): string;
  getAttr(selector: string, attr: string): string | undefined;
  getHTML(selector: string): string | null;
}
