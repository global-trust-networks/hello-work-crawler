import { difference } from "es-toolkit";

import { createBrowser } from "../browser";
import { baseUrl, blackListedColumns, tableStructure } from "../config";

const blackListedTableHeaders = ["この事業所が公開している他の求人"];
const checkTableStructure = async () => {
  const browser = await createBrowser();
  const detailsPage = await browser.newPage();

  const offers: string[] = [];
  for (const [index, offer] of offers.entries()) {
    console.log(`offer ${index + 1}/${offers.length}`);
    const url = new URL(baseUrl);
    url.search = offer;

    await detailsPage.goto(url.toString(), {
      waitUntil: "domcontentloaded",
    });

    // check table headers
    const tableHeaders = await Promise.all(
      await detailsPage
        .locator(
          `//div[contains(@class, 'fs1_5')]|//div[contains(@class, 'fb mb05')]`
        )
        .all()
        .then((result) =>
          result.map(async (locator) => await locator.innerText())
        )
        .then((result) =>
          result.filter(async (text) => {
            return !blackListedTableHeaders.includes(await text);
          })
        )
    );

    const diff = difference(
      tableHeaders.filter((text) => !blackListedTableHeaders.includes(text)),
      tableStructure.map(({ header }) => header?.text).filter(Boolean)
    );
    if (diff.length !== 0) {
      console.log(`diff: ${diff}`);
      break;
    }

    // check table contents
    for (const { header, children } of tableStructure) {
      const table = detailsPage
        .locator(
          `[class='normal mb1']:${
            header?.id === undefined
              ? header?.text === undefined
                ? `above(#${
                    tableStructure.find(
                      ({ header }) => header?.id !== undefined
                    )?.header?.id
                  })`
                : `below(:text('${header.text}'))`
              : `below(#${header.id})`
          }`
        )
        .first();

      const headers = await Promise.all(
        await table
          .locator("th")
          .all()
          .then((result) =>
            result.map((header) =>
              header.innerText().then((key) => key?.replaceAll("\n", ""))
            )
          )
      );

      const diff = difference(
        headers.filter((text) => !blackListedColumns.includes(text)),
        children
      );
      if (diff.length !== 0) {
        console.log(`table: ${header?.text} diff: ${header?.id} ${diff}`);
      }
    }
  }

  await detailsPage.close();

  await browser.close();
};
checkTableStructure().catch((error) => console.error(error));
