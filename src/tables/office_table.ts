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

        data["事業所都道府県"] = await this.getInnerText(
          content.locator("[name='szci']").first()
        ).then((response) => {
          return (
            [
              "北海道",
              "青森県",
              "岩手県",
              "宮城県",
              "秋田県",
              "山形県",
              "福島県",
              "茨城県",
              "栃木県",
              "群馬県",
              "埼玉県",
              "千葉県",
              "東京都",
              "神奈川県",
              "新潟県",
              "富山県",
              "石川県",
              "福井県",
              "山梨県",
              "長野県",
              "岐阜県",
              "静岡県",
              "愛知県",
              "三重県",
              "滋賀県",
              "京都府",
              "大阪府",
              "兵庫県",
              "奈良県",
              "和歌山県",
              "鳥取県",
              "島根県",
              "岡山県",
              "広島県",
              "山口県",
              "徳島県",
              "香川県",
              "愛媛県",
              "高知県",
              "福岡県",
              "佐賀県",
              "長崎県",
              "熊本県",
              "大分県",
              "宮崎県",
              "鹿児島県",
              "沖縄県",
            ].find((prefecture) => response?.startsWith(prefecture)) ?? null
          );
        });

        return data;
      }
      case "ホームページ":
        return await content.innerText();
      default:
        return "UNDEFINED";
    }
  }
}
