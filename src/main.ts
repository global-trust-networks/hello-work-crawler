import { OfferDetails } from "domains/offer_details";
import { OfferSearch } from "domains/offer_search";
import { GoogleService } from "utils/google_service";

const main = async () => {
  const googleService = new GoogleService();
  await googleService.clearCache();

  const searchPage = new OfferSearch();
  await searchPage.open();
  for await (const urls of searchPage.getOfferUrls({
    keyword: "外国人",
    perPage: 50,
  })) {
    await googleService.appendToCache(
      urls.map((url) => {
        const id = new URL(url).searchParams.get("kJNo") ?? "";

        return [id, url];
      })
    );
  }
  await searchPage.close();

  const detailsPage = new OfferDetails();
  await detailsPage.open();
  const urls = await googleService.getFromCache();
  for await (const details of detailsPage.getDetails(urls)) {
    const row = OfferDetails.createSpreadsheetRow(details);
    await googleService.appendToOffers([row]);
  }
  await detailsPage.close();
};
main().catch((error) => console.error(error));
