import { Temporal } from "@js-temporal/polyfill";
import { differenceBy } from "es-toolkit";

import { OfferDetails } from "domains/offer_details";
import { OfferSearch } from "domains/offer_search";
import { GoogleService } from "utils/google_service";

const main = async () => {
  const started = new Date();
  const googleService = new GoogleService();

  {
    // calculate duration since last update
    const previousDate = await googleService.getDateFromPrevious();
    const temporalStarted = Temporal.Instant.from(started.toISOString());
    const temporalPreviousDate = previousDate
      ? Temporal.Instant.from(previousDate.toISOString())
      : null;
    const difference = temporalPreviousDate
      ? temporalStarted.since(temporalPreviousDate)
      : null;
    const isLongerThanTwoDays = difference
      ? Temporal.Duration.compare(
          difference,
          Temporal.Duration.from({ days: 2 })
        ) === 1
      : false;
    const isLongerThanWeek = difference
      ? Temporal.Duration.compare(
          difference,
          Temporal.Duration.from({ days: 7 })
        ) === 1
      : false;
    if (isLongerThanWeek) {
      console.log({ isLongerThanWeek });
    } else if (isLongerThanTwoDays) {
      console.log({ isLongerThanTwoDays });
    }

    // search
    const searchPage = new OfferSearch();
    await searchPage.open();
    const urls: string[] = [];
    for await (const response of searchPage.getOfferUrls({
      keyword: "外国人",
      perPage: 50,
      newArrived: difference
        ? !isLongerThanTwoDays
          ? "2days"
          : !isLongerThanWeek
          ? "week"
          : undefined
        : undefined,
    })) {
      urls.push(...response);
    }
    await searchPage.close();

    // cache
    await googleService.clearCache();
    await googleService.appendOfferIdsToCache(
      urls.map((url) => {
        const id = new URL(url).searchParams.get("kJNo") ?? "";
        return [id, url];
      })
    );
  }
  {
    // calculate new offers
    const existingOfferIds = await googleService
      .getOfferIdsFromOffers()
      .then((ids) => ids.map((id) => ({ id: id, url: "" })));
    const cachedOffers = await googleService.getFromCache();
    const newOffers = differenceBy(
      cachedOffers,
      existingOfferIds,
      (item) => item.id
    );
    console.log({ newOffers: newOffers.length });

    if (newOffers.length > 0) {
      // details
      const detailsPage = new OfferDetails();
      await detailsPage.open();
      const rows: string[][] = [];
      for await (const details of detailsPage.getDetails(
        newOffers.map((item) => item.url).toReversed()
      )) {
        const row = OfferDetails.createSpreadsheetRow(details);
        rows.push(row);
        if (rows.length >= 100) {
          await googleService.prependOfferDetailsToOffers(rows.toReversed());
          rows.length = 0;
        }
      }
      await detailsPage.close();

      // append
      if (rows.length > 0) {
        await googleService.prependOfferDetailsToOffers(rows.toReversed());
      }

      await googleService.clearOfferIdsOfPrevious();
      await googleService.appendOfferIdsToPrevious(
        newOffers.map(({ id }) => [id])
      );
    }
    await googleService.setDateToPrevious(started);
  }
};
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
