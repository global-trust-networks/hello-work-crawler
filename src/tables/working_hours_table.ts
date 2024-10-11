import type { Locator, Page } from "playwright";

import { BasicTable } from "./basic_table";

export class WorkingHoursTable extends BasicTable {
  constructor(page: Page) {
    const tableId = "working_hours";
    super(page, tableId);
  }

  async parserMap(key: string, content: Locator) {
    switch (key) {
      case "就業時間":
        return await content.innerText();
      // return "TODO" + "\n" + (await content.innerText());
      case "時間外労働時間":
        return await content.innerText();
      // return "TODO" + "\n" + (await content.innerText());
      case "休憩時間":
        return await content.innerText();
      case "年間休日数":
        return await content.innerText();
      case "休日等":
        return await content.innerText();
      // return "TODO" + "\n" + (await content.innerText());
      default:
        return "UNDEFINED";
    }
  }
}
