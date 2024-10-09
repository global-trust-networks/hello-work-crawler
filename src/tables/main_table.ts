import type { Locator, Page } from "playwright";

import { BasicTable } from "./basic_table";

export class MainTable extends BasicTable {
  constructor(page: Page) {
    const tableId = "main";
    super(page, tableId);
  }

  async parserMap(key: string, content: Locator) {
    switch (key) {
      case "求人番号":
        return await content.innerText();
      case "受付年月日":
        return await content.innerText();
      case "紹介期限日":
        return await content.innerText();
      case "受理安定所":
        return await content.innerText();
      case "求人区分":
        return await content.innerText();
      case "オンライン自主応募の受付":
        return await content.innerText();
      case "産業分類":
        return await content.innerText();
      case "トライアル雇用併用の希望":
        return await content.innerText();
      default:
        return "UNDEFINED";
    }
  }
}
