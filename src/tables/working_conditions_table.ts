import type { Locator, Page } from "playwright";

import { BasicTable } from "./basic_table";

export class WorkingConditionsTable extends BasicTable {
  constructor(page: Page) {
    const tableId = "working_conditions";
    super(page, tableId);
  }

  async parserMap(key: string, content: Locator) {
    switch (key) {
      case "加入保険等":
        return await content.innerText();
      case "企業年金":
        return await content.innerText();
      case "退職金共済":
        return await content.innerText();
      case "退職金制度":
        return await content.innerText();
      case "定年制":
        return "TODO" + "\n" + (await content.innerText());
      case "再雇用制度":
        return "TODO" + "\n" + (await content.innerText());
      case "勤務延長":
        return await content.innerText();
      case "入居可能住宅":
        return await content.innerText();
      case "利用可能託児施設":
        return await content.innerText();
      default:
        return "UNDEFINED";
    }
  }
}
