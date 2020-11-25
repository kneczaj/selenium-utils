import { getUrl, runTestServer } from "./utils/test-content";
import { e2eTest } from "./test-base";
import { By } from "./by";
import * as http from "http";

e2eTest('ElementPromise', getUrl(), driver => {
  let server: http.Server;
  describe('simple', () => {
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
      it('has the additional methods', async () => {
        const obj = driver().findElement(By.content('hello!'));
        hasAdditionalMethods(obj);
        await obj;
      });
    });

    describe('Element', () => {
      it('has the additional methods', async () => {
        const obj = await driver().findElement(By.content('hello!'));
        hasAdditionalMethods(obj);
      });
    });
  });

  describe('complicated', () => {
    beforeAll(async () => {
      server = await runTestServer('<div class="main"><div class="inner">hello!</div></div>');
    });

    beforeEach(async () => {
      await driver().get('/');
    });

    afterAll(() => {
      server.close();
    });

    describe('error reporting', () => {
      it('reports clearly', async () => {
        const parent = driver().findElement(By.className('main'));
        const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
        await expect(parent.findElement(By.content('bye'), 1000)).rejects.toBeTruthy()
        expect(spy).toHaveBeenCalledTimes(1);
        const errorMessage = spy.mock.calls[0][0];
        // contains the html
        expect(errorMessage).toContain('<div class="inner">hello!</div>');
        // does not contain parent
        expect(errorMessage).not.toContain('<div class="main">');
        expect(errorMessage).toContain("//*[contains(text(), 'bye')]");
        expect(errorMessage).toContain("xpath");
        spy.mockRestore();
      });
    });
  });
});
