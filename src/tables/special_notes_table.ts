import type { Locator, Page } from "playwright";

import { BasicTable } from "./basic_table";

export class SpecialNotesTable extends BasicTable {
  constructor(page: Page) {
    const tableId = "special_notes";
    super(page, tableId);
  }

  async parserMap(key: string, content: Locator) {
    switch (key) {
      case "求人に関する特記事項":
        return await content.innerText();
      default:
        return "UNDEFINED";
    }
  }
}
