import type { Browser, Page } from "playwright";

import { createBrowser } from "../browser";
import { baseUrl } from "../config";

export const defaultPerPage = 30;
export type Query = {
  keyword?: string;
  perPage?: 10 | 30 | 50;
  newArrived?: "2days" | "week";
};

export class OfferSearch {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async open() {
    this.browser = await createBrowser();
    this.page = await this.browser.newPage();
  }

  async close() {
    await this.page?.close();
    await this.browser?.close();
  }

  async *getOfferUrls(query?: Query) {
    await this.search(query);

    // TODO: forof totalPage vs while hasNextPage
    const totalPage = await this.getTotalPage();
    for (const pageIndex of Array(totalPage).keys()) {
      console.log(`searchPage getOfferUrls ${pageIndex + 1}/${totalPage}`);
      yield await this.getCurrentPageOfferUrls().then((urls) =>
        urls.filter((url) => url !== null)
      );

      const hasNextPage = await this.nextPage();
      if (!hasNextPage) {
        break;
      }
    }
  }

  private async search(query?: Query) {
    if (this.page === null) {
      throw Error("NO_SEARCH_PAGE");
    }

    await this.page.goto(`${baseUrl}?action=initDisp&screenId=GECA110010`, {
      waitUntil: "domcontentloaded",
    });

    // keyword
    await this.page
      .locator("[name='freeWordInput']")
      .fill(query?.keyword ?? "");

    // newArrived
    if (query?.newArrived !== undefined) {
      if (query.newArrived === "2days") {
        await this.page.locator("#ID_LnewArrivedCKBox1").click();
      }
      if (query.newArrived === "week") {
        await this.page.locator("#ID_LnewArrivedCKBox2").click();
      }
    }

    await this.page.getByRole("button", { exact: true, name: "検索" }).click();
    await this.page.waitForLoadState("domcontentloaded");

    // perPage
    if (query?.perPage !== undefined) {
      await this.page
        .locator("[name='fwListNaviDispTop']")
        .selectOption({ label: `${query.perPage}件` });
      await this.page.waitForLoadState("networkidle");
    }
  }

  private async nextPage() {
    if (this.page === null) {
      throw Error("NO_SEARCH_PAGE");
    }

    const nextPage = this.page.getByText("次へ＞").first();
    if (await nextPage.isDisabled()) {
      return false;
    }
    await nextPage.click();
    await this.page.waitForLoadState("domcontentloaded");

    return true;
  }

  private async getCurrentPageOfferUrls() {
    if (this.page === null) {
      throw Error("NO_SEARCH_PAGE");
    }

    const offers = await this.page
      .getByRole("link", { exact: true, name: "詳細を表示" })
      .all();

    return Promise.all(
      offers.map((offer) =>
        offer.getAttribute("href").then((href) => {
          if (!href) {
            return null;
          }
          const url = new URL(href, baseUrl);
          return url.toString();
        })
      )
    );
  }

  private async getTotalPage() {
    if (this.page === null) {
      throw Error("NO_SEARCH_PAGE");
    }

    const totalText = await this.page.getByText("件中").first().textContent();
    if (!totalText) {
      throw Error("NO_TOTAL_TEXT");
    }

    const total = Number(totalText.split("件中").find(Boolean));
    const perPage = await this.page
      .locator("[name='fwListNaviDispTop']")
      .inputValue();
    const totalPage = Math.ceil(total / Number(perPage));

    return totalPage;
  }
}
