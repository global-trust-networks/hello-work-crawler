import { google, sheets_v4 } from "googleapis";

export class GoogleService {
  private sheets: sheets_v4.Sheets;

  constructor() {
    const credentials = process.env.GOOGLE_CREDENTIALS!;
    console.log({ credentials });
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(
        Buffer.from(credentials, "base64").toString("utf-8")
      ),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheets = google.sheets({ version: "v4", auth });
  }

  // Offers
  async appendOfferDetailsToOffers(rows: string[][]) {
    const spreadSheetId = process.env.OFFERS_SPREADSHEET_ID!;
    const name = process.env.OFFERS_SHEET_NAME!;

    await this.appendToGoogleSheet(spreadSheetId, rows, `${name}!A3`);
  }
  async prependOfferDetailsToOffers(rows: string[][]) {
    const spreadSheetId = process.env.OFFERS_SPREADSHEET_ID!;
    const sheetId = Number(process.env.OFFERS_SHEET_ID!);
    const name = process.env.OFFERS_SHEET_NAME!;

    await this.prependToGoogleSheet(spreadSheetId, sheetId, rows, `${name}!A3`);
  }
  async getOfferIdsFromOffers() {
    const spreadSheetId = process.env.OFFERS_SPREADSHEET_ID!;
    const name = process.env.OFFERS_SHEET_NAME!;

    return await this.getGoogleSheet(spreadSheetId, `${name}!A3:A`)
      .then((response) => response?.data.values)
      .then((response) => response?.flat() ?? [])
      .then((response) => response?.map((id) => String(id).replace("-", "")));
  }

  // Previous
  async setDateToPrevious(date: Date) {
    const spreadSheetId = process.env.OFFERS_SPREADSHEET_ID!;
    const name = process.env.PREVIOUS_SHEET_NAME!;

    await this.updateGoogleSheet(
      spreadSheetId,
      [[date.toISOString()]],
      `${name}!A1`
    );
  }
  async getDateFromPrevious() {
    const spreadSheetId = process.env.OFFERS_SPREADSHEET_ID!;
    const name = process.env.PREVIOUS_SHEET_NAME!;

    return await this.getGoogleSheet(spreadSheetId, `${name}!A1`)
      .then((response) => response?.data.values)
      .then((response) => response?.flat() ?? [])
      .then((response) => response?.find(Boolean) ?? null)
      .then((response) => {
        if (response === null) {
          return null;
        }

        return new Date(response);
      });
  }
  async getOfferIdsFromPrevious() {
    const spreadSheetId = process.env.OFFERS_SPREADSHEET_ID!;
    const name = process.env.PREVIOUS_SHEET_NAME!;

    return await this.getGoogleSheet(spreadSheetId, `${name}!A2:A`)
      .then((response) => response?.data.values)
      .then((response) => response?.flat() ?? [])
      .then((response) => response?.map(String));
  }
  async appendOfferIdsToPrevious(rows: string[][]) {
    const sheetId = process.env.OFFERS_SPREADSHEET_ID!;
    const name = process.env.PREVIOUS_SHEET_NAME!;

    await this.appendToGoogleSheet(sheetId, rows, `${name}!A2`);
  }
  async clearOfferIdsOfPrevious() {
    const spreadSheetId = process.env.OFFERS_SPREADSHEET_ID!;
    const name = process.env.PREVIOUS_SHEET_NAME!;

    await this.clearGoogleSheet(spreadSheetId, `${name}!A2:B`);
  }

  // Cache
  async appendOfferIdsToCache(rows: string[][]) {
    const spreadSheetId = process.env.OFFERS_SPREADSHEET_ID!;
    const name = process.env.CACHE_SHEET_NAME!;

    await this.appendToGoogleSheet(spreadSheetId, rows, `${name}!A1`);
  }
  async getOfferIdsFromCache() {
    const spreadSheetId = process.env.OFFERS_SPREADSHEET_ID!;
    const name = process.env.CACHE_SHEET_NAME!;

    return await this.getGoogleSheet(spreadSheetId, `${name}!A:A`)
      .then((response) => response?.data.values)
      .then((response) => response?.flat() ?? [])
      .then((response) => response?.map(String));
  }
  async getOfferUrlsFromCache() {
    const spreadSheetId = process.env.OFFERS_SPREADSHEET_ID!;
    const name = process.env.CACHE_SHEET_NAME!;

    return await this.getGoogleSheet(spreadSheetId, `${name}!B:B`)
      .then((response) => response?.data.values)
      .then((response) => response?.flat() ?? [])
      .then((response) => response?.map(String));
  }
  async getFromCache() {
    const spreadSheetId = process.env.OFFERS_SPREADSHEET_ID!;
    const name = process.env.CACHE_SHEET_NAME!;

    return await this.getGoogleSheet(spreadSheetId, `${name}!A:B`)
      .then((response) => response?.data.values)
      .then((response) => response?.filter((item) => item.length === 2))
      .then(
        (response) =>
          response?.map((item) => ({
            id: String(item[0]),
            url: String(item[1]),
          })) ?? []
      );
  }
  async clearCache() {
    const spreadSheetId = process.env.OFFERS_SPREADSHEET_ID!;
    const name = process.env.CACHE_SHEET_NAME!;

    await this.clearGoogleSheet(spreadSheetId, `${name}!A:B`);
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

  private async prependToGoogleSheet(
    spreadsheetId: string,
    sheetId: number,
    values: string[][],
    range: string
  ) {
    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              insertDimension: {
                range: {
                  sheetId,
                  dimension: "ROWS",
                  startIndex: 2,
                  endIndex: 2 + values.length,
                },
              },
            },
          ],
        },
      });
      await this.appendToGoogleSheet(spreadsheetId, values, range);
    } catch (error) {
      console.error("Google Sheet: Error prepending data", error);
    }
  }

  private async updateGoogleSheet(
    spreadsheetId: string,
    values: string[][],
    range: string
  ) {
    try {
      const requestBody = {
        values,
      };

      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        requestBody,
      });
    } catch (error) {
      console.error("Google Sheet: Error updating data", error);
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
