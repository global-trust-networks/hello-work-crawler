import type { Locator, Page } from "playwright";

import { BasicTable } from "./basic_table";

export class PRTable extends BasicTable {
  constructor(page: Page) {
    const tableId = "pr";
    super(page, tableId);
  }

  async parserMap(key: string, content: Locator) {
    switch (key) {
      case "事業所からのメッセージ":
        return await content.innerText();
      case "職務給制度":
        return await content.innerText();
      case "復職制度":
        return await content.innerText();
      case "福利厚生の内容":
        return await content.innerText();
      case "事業所に関する特記事項":
        return await content.innerText();
      default:
        return "UNDEFINED";
    }
  }
}
