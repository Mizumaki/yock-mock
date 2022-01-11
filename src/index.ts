import { setupWorker } from "msw";
// import { setupServer } from "msw/node";
import { getRequestHandlers } from "./getRequestHandlers";
import { MockDefinition, MockProxySetting } from "./type";

export type YockMockOption = {
  defaultTemplateName: string;
  /**
   * TODO: Implement Chaos Mode
   */
  chaosSettings?: {};
  mockDefinitions?: {
    templateName: string;
    mocks: MockDefinition[];
  }[];
  /**
   * Only if the request doesn't match any mockDefinitions, mockProxies handle the request
   */
  mockProxies?: {
    templateName: string;
    proxies: MockProxySetting[];
  }[];
};

export const setupYockMock = (option: YockMockOption) => {
  const worker = setupWorker(...getRequestHandlers(option));

  return worker;
};

// TODO: Extract this into another module (like 'yock-mock/node')
// export const setupYockMockServer = (option: YockMockOption) => {
//   const server = setupServer(...getRequestHandlers(option));
//   return server;
// };
