import type { Locator, Page } from "playwright";

import { BasicTable } from "./basic_table";

export class OfficeTable extends BasicTable {
  constructor(page: Page) {
    const tableId = "office";
    super(page, tableId);
  }

  async parserMap(key: string, content: Locator) {
    switch (key) {
      case "事業所番号":
        return await content.innerText();
      case "事業所名": {
        const data: Record<string, string | null> = {};

        data["事業所名"] = await this.getInnerText(
          content.locator("[name='jgshMei']").first()
        );

        data["事業所名カナ"] = await this.getInnerText(
          content.locator("[name='jgshMeiKana']").first()
        );

        return data;
      }
      case "所在地": {
        const data: Record<string, string | null> = {};

        data["事業所郵便番号"] = await this.getInnerText(
          content.locator("[name='szciYbn']").first()
        );

        data["事業所住所"] = await this.getInnerText(
          content.locator("[name='szci']").first()
        );

        return data;
      }
      case "ホームページ":
        return await content.innerText();
      default:
        return "UNDEFINED";
    }
  }
}
