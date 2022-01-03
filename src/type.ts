import type { RestRequest } from "msw";

export type MockDefinition = {
  httpMethod: HTTPMethod;
  /**
   * Routing path string used for msw routing
   * https://mswjs.io/docs/basics/request-matching#request-url
   */
  path: string;
  responseItems: {
    [ResponseKey in string]: MockResponse;
  };
} & (
  | {
      /**
       * Set `ResponseKey`
       */
      currentResponse: string;
      chaosMode?: false;
    }
  | {
      /**
       * Under `chaosMode`, automatically returns response based on `chaosSettings`
       */
      chaosMode: true;
      currentResponse?: undefined;
    }
);

export type MockProxySetting = {
  httpMethod: HTTPMethod;
  /**
   * Routing path string used for msw routing
   * https://mswjs.io/docs/basics/request-matching#request-url
   */
  path: string;
  /**
   * Proxy target URL
   * If the request matches, the request will proxy to `${targetBaseUrl}/${req.path}`
   */
  targetBaseUrl: string;
};

type Primitives =
  | boolean
  | number
  | string
  | undefined
  | null
  | object
  | unknown[];

type MockResponse = {
  status: number;
  response: Primitives | ((req: RestRequest) => Primitives);
};

type HTTPMethod = "get" | "post" | "put" | "patch" | "delete";
