import type { Locator, Page } from "playwright";

import { blackListedColumns, tableStructure } from "config";
import type { KeySelectorPair, TableStructure } from "types";

export abstract class BasicTable {
  tableId: string;
  table: Locator;
  structure: TableStructure;
  constructor(page: Page, tableId: string) {
    this.tableId = tableId;

    let table: Locator;
    if (tableId === "main") {
      table = page.locator(`[class='normal mb1']`).first();
    } else if (tableId === "disabilities") {
      const header = tableStructure.find(({ key }) => key === tableId)?.header;
      table = page
        .locator(`[class='normal mb1']:below(:text('${header?.text}'))`)
        .first();
    } else {
      const header = tableStructure.find(({ key }) => key === tableId)?.header;
      table = page
        .locator(`[class='normal mb1']:below(#${header?.id})`)
        .first();
    }
    this.table = table;

    const structure = tableStructure.find((item) => item.key === tableId);
    if (structure === undefined) {
      throw Error(`${tableId} table is not defined in config`);
    }
    this.structure = structure;
  }

  async getValues() {
    const tableCount = await this.table.count();
    if (tableCount !== 1) {
      return {};
    }

    const data: Record<string, string | null> = {};
    for (const key of this.structure.children) {
      if (!blackListedColumns.includes(key)) {
        const parsed = await this.getParsedContentByKey(key);

        if (typeof parsed === "string" || parsed === null) {
          data[key] = parsed;
          continue;
        }

        for (const [key, value] of Object.entries(parsed)) {
          data[key] = value;
        }
      }
    }

    return data;
  }

  private async getParsedContentByKey(key: string) {
    const content = await this.getContentByKey(key);
    if (content === null || (await content.count()) !== 1) {
      return null;
    }

    const parsed = await this.parserMap(key, content);

    return parsed ?? null;
  }

  private async getContentByKey(key: string) {
    const row = this.table.locator(`tr:has-text("${key}")`).first();
    if ((await row.count()) !== 1) {
      return null;
    }

    const content = row.locator("td").first();

    return content;
  }

  protected abstract parserMap(
    key: string,
    content: Locator
  ): Promise<string | Record<string, string | null> | null>;

  protected async getInnerText(element: Locator) {
    if ((await element.count()) !== 1) {
      return null;
    }

    return await element.innerText();
  }

  protected objectToString(data: Record<string, string | null>) {
    const spacer = "\n";
    return Object.entries(data)
      .map(([key, value]) => `${key}: ${value}`)
      .join(spacer);
  }

  protected async keySelectorPairsToRecord(
    pairs: {
      key: string;
      selector: string | KeySelectorPair[];
    }[],
    element: Locator
  ) {
    const data: Record<string, string | null> = {};

    for (const { key, selector } of pairs) {
      const header = element.getByText(key, { exact: true });
      if ((await header.count()) !== 1) {
        continue;
      }

      if (typeof selector === "string") {
        const body = element.locator(selector).first();
        if ((await body.count()) !== 1) {
          continue;
        }

        data[key] = await body.innerText();
      } else {
        for (const item of selector) {
          const body = element.locator(item.selector).first();
          if ((await body.count()) !== 1) {
            continue;
          }

          data[`${key}/${item.key}`] = await body.innerText();
        }
      }
    }

    return data;
  }
}
