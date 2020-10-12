import { AugmentedThenableWebDriver } from "./driver";
import { Locator, WebElement } from "selenium-webdriver";
import { ElementPromise } from "./element";

export abstract class Page {

  constructor(
    protected driver: AugmentedThenableWebDriver,
    protected element?: WebElement
  ) {
  }

  find(locator: Locator, timeout?: number): ElementPromise {
    return this.driver.findElement(locator, timeout);
  }

  abstract async assertLoaded(): Promise<any>;
}


export type PageClass<T extends Page> = (new(
  driver: AugmentedThenableWebDriver,
  element?: WebElement
) => T);

export async function Factory<T extends Page, TPageClass extends PageClass<T>>(
  pageClass: TPageClass,
  driver: AugmentedThenableWebDriver,
  element?: WebElement
): Promise<T> {
  const result = new pageClass(driver, element);
  await result.assertLoaded();
  return result;
}

export class Elements {
  constructor(
    protected driver: AugmentedThenableWebDriver,
    protected elements: WebElement[]
  ) {}
}
