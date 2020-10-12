import { getUrl, runTestServer } from "./test-content";
import { e2eTest } from "../test-base";
import { By } from "../by";
import * as http from "http";

e2eTest('Test content', getUrl(), driver => {
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

  it('runs test content server', async () => {
    await driver().findElement(By.content('hello!'));
  });

  it('makes this again', async () => {
    await driver().findElement(By.content('hello!'));
  });
});
