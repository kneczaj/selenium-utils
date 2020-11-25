import { AugmentedThenableWebDriver } from "./driver";
import { Locator, ThenableWebDriver, WebElement } from "selenium-webdriver";
import { Element, ElementPromise, isElement } from "./element";

export class Component extends WebElement {
  constructor(protected driver: AugmentedThenableWebDriver, element: Element) {
    super(driver as unknown as ThenableWebDriver, element.getId());
  }
}

export type ComponentClass<T extends Component> = (new(
  driver: AugmentedThenableWebDriver,
  element: Element
) => T) & {
  rootElementLocator: Locator;
};

export type ShadowComponentClass<T extends Component> = ComponentClass<T> & {
  isShadowComponent: true;
}

function isClassComponentShadowType<T extends Component>(val: ComponentClass<T> | ShadowComponentClass<T>): val is ShadowComponentClass<T> {
  return (val as ShadowComponentClass<T>).isShadowComponent;
}

export async function componentFactory<T extends Component, TComponentClass extends ComponentClass<T>>(
  componentClass: TComponentClass,
  parent: Element | AugmentedThenableWebDriver,
): Promise<T> {
  const rootElement = parent.findElement(componentClass.rootElementLocator);
  const expanded: ElementPromise = isClassComponentShadowType(componentClass) ? rootElement.expandShadowElement() : rootElement;
  const driver = isElement(parent) ? parent.getDriver() : parent;
  return new componentClass(driver, await expanded);
}
