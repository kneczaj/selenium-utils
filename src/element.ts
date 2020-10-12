import { Locator, WebDriver, WebElement, WebElementPromise } from "selenium-webdriver";
import { AugmentedThenableWebDriver, AugmentedWebDriver } from "./driver/model";

type WebElementClass = new(...args: any[]) => WebElement;

export interface AugmentedWebElement extends Omit<WebElement, 'findElement' | 'getDriver'> {
  getDriver(): AugmentedThenableWebDriver;
  clickAnyway(): Promise<void>;
  /**
   * The result element will not work with By.xpath selector
   * NotSupportedError: Failed to execute 'evaluate' on 'Document': The node provided is '#document-fragment', which is not a valid context node type.
   * https://github.com/SeleniumHQ/selenium/issues/4971
   */
  expandShadowElement(): ElementPromise;
  findElement(locator: Locator, timeout?: number): ElementPromise;
}

type AugmentedWebElementClass = new(...args: any[]) => AugmentedWebElement;

function classFactory<TBaseClass extends WebElementClass>(BaseClass: TBaseClass): AugmentedWebElementClass {
  return class extends BaseClass implements Omit<WebElement, 'findElement' | 'getDriver'>, AugmentedWebElement {
    getDriver(): AugmentedThenableWebDriver {
      return super.getDriver() as unknown as AugmentedThenableWebDriver;
    }

    clickAnyway(): Promise<void> {
      return this.getDriver().executeScript((element: any) => element.click(), this);
    }

    /**
     * The result element will not work with By.xpath selector
     * NotSupportedError: Failed to execute 'evaluate' on 'Document': The node provided is '#document-fragment', which is not a valid context node type.
     * https://github.com/SeleniumHQ/selenium/issues/4971
     */
    expandShadowElement(): ElementPromise {
      return new ElementPromise(
        this.getDriver(),
        this.getDriver()
          .executeScript<WebElement>((element: any) => element.shadowRoot, this)
          .then(fromWebElement)
      );
    }

    // NOTE: this changes args list
    // @ts-ignore
    findElement(locator: Locator, timeout?: number): ElementPromise {
      const orgFindElement = super.findElement.bind(this);
      return new ElementPromise(this.getDriver(), this.getDriver().wait<Element>(async function (driver) {
        try {
          return await orgFindElement(locator);
        } catch (e) {
          return false;
        }
      }, timeout));
    }
  }
}

export class ElementPromise extends classFactory(WebElementPromise) {
  constructor(driver: AugmentedWebDriver, el: Promise<Element>) {
    super(driver, el);
  }

  then<TResult1 = Element, TResult2 = never>(
    onfulfilled?: ((value: Element) => (PromiseLike<TResult1> | TResult1)) | undefined | null,
    onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null
  ): Promise<TResult1 | TResult2> {
    // @ts-ignore
    return super.then(onfulfilled, onrejected);
  }
}

export class Element extends classFactory(WebElement) {
  constructor(driver: AugmentedThenableWebDriver, id: Promise<string>|string) {
    super(driver as unknown as WebDriver, id);
  }
}

export function fromWebElement(webElement: WebElement): Element {
  return new Element(webElement.getDriver() as AugmentedThenableWebDriver, webElement.getId());
}
