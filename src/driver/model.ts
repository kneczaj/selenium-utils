import { Locator, ThenableWebDriver, WebDriver, WebElementPromise } from "selenium-webdriver";
import { ElementPromise } from "../element";
import { Component, ComponentClass } from "../component";

export interface ScreenSize {
  width: number;
  height: number;
}

export interface DriverParams {
  screenSize: ScreenSize;
  timeout: number;
  limitErrorMessageToBody: boolean;
  removeScriptTagsFromLog: boolean;
}

export interface WithFind {
  findElement: (locator: Locator, timeout?: number) => ElementPromise;
  findComponent: <T extends Component>(componentClass: ComponentClass<T>) => Promise<T>;
}

export interface AugmentedWebDriver extends Omit<WebDriver, 'findElement'>, WithFind {
  /**
   * The standard get gets substituted with getting the path relative to base url,
   * and this is the original get for absolute paths
   */
  getAbsolute: ThenableWebDriver['get'];
  noWaitFindElement: ThenableWebDriver['findElement'];
  clickAnyway: (this: AugmentedThenableWebDriver, element: WebElementPromise) => Promise<void>;
}

export interface AugmentedThenableWebDriver extends AugmentedWebDriver, Promise<AugmentedWebDriver> {}
