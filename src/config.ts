import { DriverParams, ScreenSize } from "./driver/model";

export const STANDARD_SCREEN: ScreenSize = {
  width: 1440,
  height: 877
};

export const DEFAULT_DRIVER_PARAMS: DriverParams = {
  screenSize: STANDARD_SCREEN,
  timeout: 5000
}
