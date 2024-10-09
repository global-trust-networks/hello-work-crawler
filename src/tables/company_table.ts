import type { Locator, Page } from "playwright";

import { BasicTable } from "./basic_table";

export class CompanyTable extends BasicTable {
  constructor(page: Page) {
    const tableId = "company";
    super(page, tableId);
  }

  async parserMap(key: string, content: Locator) {
    switch (key) {
      case "従業員数":
        return "TODO" + "\n" + (await content.innerText());
      case "設立年":
        return await content.innerText();
      case "資本金":
        return await content.innerText();
      case "労働組合":
        return await content.innerText();
      case "事業内容":
        return await content.innerText();
      case "会社の特長":
        return await content.innerText();
      case "役職／代表者名":
        return "TODO" + "\n" + (await content.innerText());
      case "法人番号":
        return await content.innerText();
      case "就業規則":
        return "TODO" + "\n" + (await content.innerText());
      case "育児休業取得実績":
        return await content.innerText();
      case "介護休業取得実績":
        return await content.innerText();
      case "看護休暇取得実績":
        return await content.innerText();
      case "外国人雇用実績":
        return await content.innerText();
      case "UIJターン歓迎":
        return await content.innerText();
      default:
        return "UNDEFINED";
    }
  }
}
