import { getUrl, runTestServer } from "../test-content";
import { e2eTest } from "../test-base";
import * as http from "http";
import { By } from "../by";

e2eTest('Augmented driver', getUrl(), driver => {
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

  describe('error reporting', () => {
    it('reports clearly', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      await expect(driver().findElement(By.content('bye'), 1000)).rejects.toBeTruthy()
      expect(spy).toHaveBeenCalledTimes(1);
      const errorMessage = spy.mock.calls[0][0];
      // contains the html
      expect(errorMessage).toContain('<div>hello!</div>')
      expect(errorMessage).toContain("//*[contains(text(), 'bye')]");
      expect(errorMessage).toContain("xpath");
      spy.mockRestore();
    });
  });
});
