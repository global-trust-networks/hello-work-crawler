import minimist from "minimist";
import { chromium } from "playwright";

type Args = {
  headless?: string;
};
export const createBrowser = async () => {
  const { executablePath, headless } = minimist<Args>(process.argv.slice(2));

  const browser = await chromium.launch({
    executablePath,
    headless: !(headless === "false"),
  });
  return browser;
};
