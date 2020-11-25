import express from "express";
import http from "http";

export const PORT = 3001;

export function getUrl() {
  return `http://localhost:${PORT}`;
}

export function makePage(content: string) {
  return (`
<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Test page</title>
  </head>
  <body>
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
    <div id="root">${content}</div>
  </body>
</html>
  `);
}

export function runTestServer(content: string): Promise<http.Server> {
  return new Promise(resolve => {
    const app = express();
    app.get('/', (req, res) => {
      res.send(makePage(content));
    });
    const httpServer = app.listen(PORT, () => {
      console.log(`App listening at http://localhost:${PORT}`);
      resolve(httpServer);
    });
  });
}
