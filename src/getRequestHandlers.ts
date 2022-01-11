import { rest, RequestHandler } from "msw";
import type { YockMockOption } from ".";
import { headersToObject } from "headers-utils";

export const getRequestHandlers = ({
  defaultTemplateName,
  mockDefinitions,
  mockProxies,
}: YockMockOption): RequestHandler[] => {
  let handlers: RequestHandler[] = [];

  // TODO: Implement Client-side override feature
  const currentTemplateName = defaultTemplateName;

  const currentMockDefinitions = mockDefinitions?.find(
    (d) => d.templateName === currentTemplateName
  );
  const currentMockProxy = mockProxies?.find(
    (p) => p.templateName === currentTemplateName
  );

  if (currentMockDefinitions) {
    for (const mock of currentMockDefinitions.mocks) {
      handlers.push(
        rest[mock.httpMethod](mock.path, (req, res, ctx) => {
          const resItem = mock.chaosMode
            ? mock.responseItems[0]
            : mock.responseItems[mock.currentResponse];

          const resBody =
            typeof resItem.response === "function"
              ? resItem.response(req)
              : resItem?.response;
          return res(ctx.status(resItem.status), ctx.json(resBody));
        })
      );
    }
  }

  if (currentMockProxy) {
    for (const proxy of currentMockProxy.proxies) {
      handlers.push(
        rest[proxy.httpMethod](proxy.path, async (req, res, ctx) => {
          const proxyReq = { ...req };
          proxyReq.url = new URL(req.url.pathname, proxy.targetBaseUrl)
          const originalRes = await ctx.fetch(proxyReq);
          return res(
            ctx.status(originalRes.status),
            ctx.set(headersToObject(originalRes.headers)),
            ctx.body(await originalRes.text())
          );
        })
      );
    }
  }

  return handlers;
};
