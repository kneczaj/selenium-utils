import { AugmentedThenableWebDriver, getAugmentedDriver } from "./driver";
import { logging } from "selenium-webdriver";
import { DriverParams } from "./driver/model";
import { DEFAULT_DRIVER_PARAMS } from "./config";

export type GetDriver = () => AugmentedThenableWebDriver;

export function e2eTest(
  label: string,
  baseUrl: string,
  testFn: (driver: GetDriver) => void,
  driverParamsOverride?: Partial<DriverParams>
) {
  describe(label, () => {
    let driver: AugmentedThenableWebDriver;
    const getDriver = () => driver;
    beforeEach(async () => {
      const params: DriverParams = {
        ...DEFAULT_DRIVER_PARAMS,
        ...driverParamsOverride
      }
      driver = (await getAugmentedDriver(params, baseUrl)) as AugmentedThenableWebDriver;
      await driver.manage().window().setRect({ x: 0, y: 0, ...params.screenSize });
    });
    testFn(getDriver);
    afterEach(async () => {
      const driver = getDriver();
      const entries = await driver.manage().logs().get(logging.Type.BROWSER);
      entries.forEach(entry => {
        console.log(`[${entry.level.name}] ${entry.message}`);
      });
      await driver.quit();
    });
  });
}
