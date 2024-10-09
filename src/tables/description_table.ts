import type { Locator, Page } from "playwright";

import { BasicTable } from "./basic_table";

export class DescriptionTable extends BasicTable {
  constructor(page: Page) {
    const tableId = "description";
    super(page, tableId);
  }

  async parserMap(key: string, content: Locator) {
    switch (key) {
      case "職種":
        return await this.getInnerText(
          content.locator("[name='sksu']").first()
        );
      case "仕事内容":
        return await content.innerText();
      case "雇用形態":
        return await content.innerText();
      case "派遣・請負等": {
        const data = await this.keySelectorPairsToRecord(
          [
            {
              key: "就業形態",
              selector: "[name='hakenUkeoiToShgKeitai']",
            },
          ],
          content
        );

        return this.objectToString(data);
      }
      case "雇用期間":
        return await content.innerText();
      case "就業場所": {
        const data = await this.keySelectorPairsToRecord(
          [
            {
              key: "就業場所",
              selector: [
                { key: "場所", selector: "[name='shgBs']" },
                { key: "郵便番号", selector: "[name='shgBsYubinNo']" },
                { key: "住所", selector: "[name='shgBsJusho']" },
              ],
            },
            {
              key: "最寄り駅",
              selector: "[name='shgBsMyorEki']",
            },
            {
              key: "最寄り駅から就業場所までの交通手段",
              selector: "[name='shgBsKotsuShudan']",
            },
            {
              key: "所要時間",
              selector: "[name='shgBsShyoJn']",
            },
            {
              key: "就業場所に関する特記事項",
              selector: "[name='shgBsTkjk']",
            },
            {
              key: "受動喫煙対策",
              selector: "[name='shgBsKitsuTsak']",
            },
          ],
          content
        );

        return this.objectToString(data);
      }
      case "マイカー通勤": {
        const data = await this.keySelectorPairsToRecord(
          [
            {
              key: "マイカー通勤",
              selector: "[name='mycarTskn']",
            },
          ],
          content
        );

        return this.objectToString(data);
      }
      case "転勤の可能性": {
        const data = await this.keySelectorPairsToRecord(
          [
            {
              key: "転勤の可能性の有無",
              selector: "[name='tenkinNoKnsi']",
            },
            {
              key: "転勤範囲",
              selector: "[name='tenkinNoKnsiTenkinHanni']",
            },
          ],
          content
        );

        return this.objectToString(data);
      }
      case "年齢": {
        const data: Record<string, string | null> = {};

        const ageLimit = await this.getInnerText(
          content.locator("[name='nenreiSegn']").first()
        );
        if (ageLimit === "制限あり") {
          const delimiter = "〜";
          const ageRange = await this.getInnerText(
            content.locator("[name='nenreiSegnHanni']").first()
          );

          if (ageRange && ageRange.includes(delimiter)) {
            data["年齢下限"] =
              ageRange.split(delimiter)[0].replace("歳", "") ?? null;
            data["年齢上限"] =
              ageRange.split(delimiter)[1].replace("歳", "") ?? null;
          }
        }

        return data;
        // const data = await this.keySelectorPairsToRecord(
        //   [
        //     {
        //       key: "年齢制限",
        //       selector: "[name='nenreiSegn']",
        //     },
        //     {
        //       key: "年齢制限範囲",
        //       selector: "[name='nenreiSegnHanni']",
        //     },
        //     {
        //       key: "年齢制限該当事由",
        //       selector: "[name='nenreiSegnGaitoJiyu']",
        //     },
        //     {
        //       key: "年齢制限の理由",
        //       selector: "[name='nenreiSegnNoRy']",
        //     },
        //   ],
        //   content
        // );

        // return data;
      }
      case "学歴":
        return await content.innerText();
      case "必要な経験等": {
        const data = await this.keySelectorPairsToRecord(
          [
            {
              key: "必要な経験・知識・技能等",
              selector: [
                { key: "必須", selector: "[name='hynaKiknt']" },
                // TODO: 不問
                // https://www.hellowork.mhlw.go.jp/kensaku/GECA110010.do?screenId=GECA110010&action=dispDetailBtn&kJNo=0505003686541&kJKbn=1&jGSHNo=7H6R7gox%2FBpl55WeqowRWA%3D%3D&fullPart=2&iNFTeikyoRiyoDtiID=&kSNo=&newArrived=&tatZngy=1&shogaiKbn=0
                // { key: "経験", selector: "[name='hynaKikntShsi']" },
              ],
            },
          ],
          content
        );

        return this.objectToString(data);
      }
      case "必要なＰＣスキル":
        return await content.innerText();
      case "必要な免許・資格":
        return await content.innerText();
      case "試用期間": {
        const data = await this.keySelectorPairsToRecord(
          [
            {
              key: "期間",
              selector: "[name='trialKikanKikan']",
            },
            {
              key: "試用期間中の労働条件",
              selector: "[name='trialKikanChuuNoRodoJkn']",
            },
            {
              key: "試用期間中の労働条件の内容",
              selector: "[name='trialKikanChuuNoRodoJknNoNy']",
            },
          ],
          content
        );

        data["あり・なし"] = await this.getInnerText(
          content.locator("[name='trialKikan']").first()
        );

        return this.objectToString(data);
      }
      default:
        return "UNDEFINED";
    }
  }
}
