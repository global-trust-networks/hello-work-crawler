import type { Locator, Page } from "playwright";

import { BasicTable } from "./basic_table";

export class DisabilitiesTable extends BasicTable {
  constructor(page: Page) {
    const tableId = "disabilities";
    super(page, tableId);
  }

  async parserMap(key: string, content: Locator) {
    switch (key) {
      case "企業在籍型ジョブコーチの有無":
        return await content.innerText();
      case "エレベーター":
        return await content.innerText();
      case "点字設備":
        return await content.innerText();
      case "階段の手すり":
        return await content.innerText();
      // return "TODO" + "\n" + (await content.innerText());
      case "建物内の車いす移動":
        return await content.innerText();
      case "休憩室":
        return await content.innerText();
      case "バリアフリー対応トイレ":
        return await content.innerText();
      case "障害者に配慮したその他の施設・設備等":
        return await content.innerText();
      default:
        return "UNDEFINED";
    }
  }
}
