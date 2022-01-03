export const removeTrailingSlash = (url: string) => {
  return url[url.length - 1] === "/" ? url.slice(0, url.length - 1) : url;
};
