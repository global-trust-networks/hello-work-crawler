import { google, sheets_v4 } from "googleapis";

export class GoogleService {
  private sheets: sheets_v4.Sheets;

  constructor() {
    const credentials = process.env.GOOGLE_CREDENTIALS!;
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(
        Buffer.from(credentials, "base64").toString("utf-8")
      ),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheets = google.sheets({ version: "v4", auth });
  }

  async appendToOffers(rows: string[][]) {
    const sheetId = process.env.OFFERS_SPREADSHEET_ID!;
    const name = process.env.OFFERS_SHEET_NAME!;

    await this.appendToGoogleSheet(sheetId, rows, `${name}!A1`);
  }
  async appendToCache(rows: string[][]) {
    const sheetId = process.env.OFFERS_SPREADSHEET_ID!;
    const name = process.env.CACHE_SHEET_NAME!;

    await this.appendToGoogleSheet(sheetId, rows, `${name}!A1`);
  }
  async getFromCache() {
    const sheetId = process.env.OFFERS_SPREADSHEET_ID!;
    const name = process.env.CACHE_SHEET_NAME!;

    return await this.getGoogleSheet(sheetId, `${name}!B:B`)
      .then((response) => response?.data.values?.flat() ?? [])
      .then((response) => response?.map(String));
  }
  async clearCache() {
    const sheetId = process.env.OFFERS_SPREADSHEET_ID!;
    const name = process.env.CACHE_SHEET_NAME!;

    await this.clearGoogleSheet(sheetId, `${name}!A:B`);
  }

  private async getGoogleSheet(spreadsheetId: string, range: string) {
    try {
      return await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
    } catch (error) {
      console.error("Google Sheet: Error getting data", error);
    }
  }

  private async appendToGoogleSheet(
    spreadsheetId: string,
    values: string[][],
    range: string
  ) {
    try {
      const requestBody = {
        values,
      };

      await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        requestBody,
      });
    } catch (error) {
      console.error("Google Sheet: Error adding data", error);
    }
  }

  private async clearGoogleSheet(spreadsheetId: string, range: string) {
    try {
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId,
        range,
      });
    } catch (error) {
      console.error("Google Sheet: Error clearing data", error);
    }
  }
}
