import { AugmentedThenableWebDriver } from "./driver";
import { Locator, WebElement } from "selenium-webdriver";
import { ElementPromise } from "./element";
import { WithFind } from "./driver/model";
import { Component, ComponentClass } from "./component";

export abstract class Page implements WithFind {

  constructor(
    protected driver: AugmentedThenableWebDriver
  ) {}

  findElement(locator: Locator, timeout?: number): ElementPromise {
    return this.driver.findElement(locator, timeout);
  }

  findComponent<T extends Component>(componentClass: ComponentClass<T>): Promise<T> {
    return this.driver.findComponent(componentClass);
  }

  abstract async assertLoaded(): Promise<any>;
}

export type PageClass<T extends Page> = (new(
  driver: AugmentedThenableWebDriver
) => T) & {
  factory: (
    driver: AugmentedThenableWebDriver
  ) => Promise<T>
};

export async function Factory<T extends Page, TPageClass extends PageClass<T>>(
  pageClass: TPageClass,
  driver: AugmentedThenableWebDriver,
): Promise<T> {
  const result = new pageClass(driver);
  await result.assertLoaded();
  return result;
}
