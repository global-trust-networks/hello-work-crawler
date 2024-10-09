import type { Locator, Page } from "playwright";

import { BasicTable } from "./basic_table";

export class SelectionTable extends BasicTable {
  constructor(page: Page) {
    const tableId = "selection";
    super(page, tableId);
  }

  async parserMap(key: string, content: Locator) {
    switch (key) {
      case "採用人数":
        return "TODO" + "\n" + (await content.innerText());
      case "選考方法":
        return await content.innerText();
      case "選考結果通知":
        return "TODO" + "\n" + (await content.innerText());
      case "求職者への通知方法":
        return await content.innerText();
      case "選考日時等":
        return "TODO" + "\n" + (await content.innerText());
      case "選考場所":
        return "TODO" + "\n" + (await content.innerText());
      case "応募書類等":
        return "TODO" + "\n" + (await content.innerText());
      case "応募書類の返戻":
        return await content.innerText();
      case "選考に関する特記事項":
        return await content.innerText();
      case "担当者":
        return "TODO" + "\n" + (await content.innerText());
      default:
        return "UNDEFINED";
    }
  }
}
