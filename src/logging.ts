import { Locator } from "selenium-webdriver";
import { isBy } from "./by";

export function stringifyLocator(locator: Locator): string | Locator {
  if (isBy(locator)) {
    return `using ${locator.using} with value "${locator.value}"`;
  }
  return locator;
}

export function logFindElementError(locator: Locator, searchContext: string) {
  console.error(`
Error while looking for ${stringifyLocator(locator)}

-------------------------------------------------
Search context
-------------------------------------------------
${searchContext}
`);
}
