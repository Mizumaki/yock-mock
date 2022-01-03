import { setupWorker } from "msw";
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
