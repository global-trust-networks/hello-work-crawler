import minimist from "minimist";
import { chromium } from "playwright";

type Args = {
  headless?: string;
};
export const createBrowser = async () => {
  const { headless } = minimist<Args>(process.argv.slice(2));

  const browser = await chromium.launch({
    headless: !(headless === "false"),
  });
  return browser;
};
