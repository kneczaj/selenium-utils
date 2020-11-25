export function isNull(val: any): val is null {
  return val === null;
}

export function isUndefined(val: any): val is undefined {
  return val === undefined;
}

export function isNullOrUndefined(val: any): val is (null | undefined) {
  return isNull(val) || isUndefined(val);
}
