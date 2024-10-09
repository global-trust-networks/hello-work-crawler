import type { Browser, Page } from "playwright";

import { spreadSheetColumnsMap } from "../config";
import { createBrowser } from "../browser";
import {
  CompanyTable,
  DescriptionTable,
  DisabilitiesTable,
  MainTable,
  OfficeTable,
  PRTable,
  SelectionTable,
  SpecialNotesTable,
  WagesTable,
  WorkingConditionsTable,
  WorkingHoursTable,
} from "../tables";

export class OfferDetails {
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

  async *getDetails(urls: string[]) {
    for (const [index, url] of urls.entries()) {
      console.log(`detailsPage getOfferDetails ${index + 1}/${urls.length}`);
      yield await this.getDetailsByUrl(url);
    }
  }

  private async getDetailsByUrl(url: string) {
    if (this.page === null) {
      throw Error("NO_DETAILS_PAGE");
    }

    await this.page.goto(url, { waitUntil: "domcontentloaded" });

    const mainTable = new MainTable(this.page);
    const mainTableData = await mainTable.getValues();

    const officeTable = new OfficeTable(this.page);
    const officeTableData = await officeTable.getValues();

    const descriptionTable = new DescriptionTable(this.page);
    const descriptionTableData = await descriptionTable.getValues();

    const wagesTable = new WagesTable(this.page);
    const wagesTableData = await wagesTable.getValues();

    const workingHoursTable = new WorkingHoursTable(this.page);
    const workingHoursTableData = await workingHoursTable.getValues();

    const workingConditionsTable = new WorkingConditionsTable(this.page);
    const workingConditionsTableData = await workingConditionsTable.getValues();

    const companyTable = new CompanyTable(this.page);
    const companyTableData = await companyTable.getValues();

    const selectionTable = new SelectionTable(this.page);
    const selectionTableData = await selectionTable.getValues();

    const specialNotesTable = new SpecialNotesTable(this.page);
    const specialNotesTableData = await specialNotesTable.getValues();

    const prTable = new PRTable(this.page);
    const prTableData = await prTable.getValues();

    const disabilitiesTable = new DisabilitiesTable(this.page);
    const disabilitiesTableData = await disabilitiesTable.getValues();

    return {
      ...mainTableData,
      ...officeTableData,
      ...descriptionTableData,
      ...wagesTableData,
      ...workingHoursTableData,
      ...workingConditionsTableData,
      ...companyTableData,
      ...selectionTableData,
      ...specialNotesTableData,
      ...prTableData,
      ...disabilitiesTableData,
    };
  }

  static createSpreadsheetRow(data: Record<string, string | null>) {
    const row: string[] = [];
    for (const [key, value] of Object.entries(data)) {
      const index = spreadSheetColumnsMap[key];
      if (index !== undefined) {
        row[index] = value ?? "";
      }
    }

    return row;
  }
}
