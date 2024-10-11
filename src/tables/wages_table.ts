import type { Locator, Page } from "playwright";

import { BasicTable } from "./basic_table";

export class WagesTable extends BasicTable {
  constructor(page: Page) {
    const tableId = "wages";
    super(page, tableId);
  }

  async parserMap(key: string, content: Locator) {
    switch (key) {
      case "ａ ＋ ｂ（固定残業代がある場合はａ ＋ ｂ ＋ ｃ）": {
        const data = await this.keySelectorPairsToRecord(
          [
            {
              key: "※フルタイム求人の場合は月額（換算額）、パート求人の場合は時間額を表示しています。",
              selector: "[name='chgn']",
            },
          ],
          content
        );

        return this.objectToString(data);
      }
      case "基本給（ａ）": {
        const data = await this.keySelectorPairsToRecord(
          [
            {
              key: "基本給（月額平均）又は時間額",
              selector: "[name='khky']",
            },
          ],
          content
        );

        return this.objectToString(data);
      }
      case "定額的に支払われる手当（ｂ）":
        return await content.innerText();
      case "固定残業代（ｃ）": {
        const data = await this.keySelectorPairsToRecord(
          [
            {
              key: "固定残業代に関する特記事項",
              selector: "[name='koteiZngyTkjk']",
            },
          ],
          content
        );
        data["あり・なし"] = await this.getInnerText(
          content.locator("[name='koteiZngyKbn']").first()
        );
        // TODO: なし
        // https://www.hellowork.mhlw.go.jp/kensaku/GECA110010.do?screenId=GECA110010&action=dispDetailBtn&kJNo=0505003686541&kJKbn=1&jGSHNo=7H6R7gox%2FBpl55WeqowRWA%3D%3D&fullPart=2&iNFTeikyoRiyoDtiID=&kSNo=&newArrived=&tatZngy=1&shogaiKbn=0
        // data["固定残業代"] = await element
        //   .locator("[name='koteiZngy']")
        //   .first()
        //   .innerText();

        return this.objectToString(data);
      }
      case "その他の手当等付記事項（ｄ）":
        return await content.innerText();
      case "月平均労働日数":
        return await content.innerText();
      case "賃金形態等":
        return await content.innerText();
      case "通勤手当":
        return await content.innerText();
      // return "TODO" + "\n" + (await content.innerText());
      case "賃金締切日":
        return await content.innerText();
      case "賃金支払日":
        return await content.innerText();
      // return "TODO" + "\n" + (await content.innerText());
      case "昇給":
        return await content.innerText();
      // return "TODO" + "\n" + (await content.innerText());
      case "賞与":
        return await content.innerText();
      // return "TODO" + "\n" + (await content.innerText());
      default:
        return "UNDEFINED";
    }
  }
}
