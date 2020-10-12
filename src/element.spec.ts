import { getUrl, runTestServer } from "./utils/test-content";
import { e2eTest } from "./test-base";
import { By } from "./by";
import * as http from "http";

e2eTest('ElementPromise', getUrl(), driver => {
  let server: http.Server;
  beforeAll(async () => {
    server = await runTestServer('<div>hello!</div>');
  });

  beforeEach(async () => {
    await driver().get('/');
  });

  afterAll(() => {
    server.close();
  });

  function hasAdditionalMethods(val: any) {
    expect(val.clickAnyway).toBeDefined();
    expect(val.expandShadowElement).toBeDefined();
  }

  describe('ElementPromise', () => {
    it('has the additional methods', () => {
      const obj = driver().findElement(By.content('hello!'));
      hasAdditionalMethods(obj);
    });
  });

  describe('Element', () => {
    it('has the additional methods', async () => {
      const obj = await driver().findElement(By.content('hello!'));
      hasAdditionalMethods(obj);
    });
  });
});
