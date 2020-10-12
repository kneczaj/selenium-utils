import { Locator, ThenableWebDriver, WebDriver, WebElementPromise } from "selenium-webdriver";
import { ElementPromise } from "../page";

export interface ScreenSize {
  width: number;
  height: number;
}

export interface DriverParams {
  screenSize: ScreenSize;
  timeout: number;
}

export interface AugmentedWebDriver extends WebDriver {
  /**
   * The standard get gets substituted with getting the path relative to base url,
   * and this is the original get for absolute paths
   */
  getAbsolute: ThenableWebDriver['get'];
  noWaitFindElement: ThenableWebDriver['findElement'];
  clickAnyway: (this: AugmentedThenableWebDriver, element: WebElementPromise) => Promise<void>;
  findElement: (locator: Locator, timeout?: number) => ElementPromise;
}

export interface AugmentedThenableWebDriver extends AugmentedWebDriver, Promise<AugmentedWebDriver> {}
