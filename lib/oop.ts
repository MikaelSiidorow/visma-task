import type { ValidPath, ValidScheme } from "./types";
import { VALID_PARAMS, VALID_PATHS, VALID_SCHEMES } from "./types";

/**
 * @class RequestIdentifier
 * @description
 * RequestIdentifier is a class that represents a URI that is used to identify
 * a request from the native app.
 */
export default class RequestIdentifier {
  readonly path: ValidPath;
  readonly params: Record<string, string | number>;

  /**
   *
   * @param uri
   * @throws Error if uri is invalid
   * @example
   * const uri = "visma-identity://login?source=app"
   * const requestIdentifier = new RequestIdentifier(uri)
   * requestIdentifier.path // "login"
   * requestIdentifier.params // { source: "app" }
   */
  constructor(uri: string) {
    const { path, params } = this.#validateURI(uri);
    this.path = path;
    this.params = params;
  }

  #validateScheme = (scheme: string): scheme is ValidScheme =>
    VALID_SCHEMES.includes(scheme as ValidScheme);

  #validatePath = (path: string): path is ValidPath =>
    VALID_PATHS.includes(path as ValidPath);

  #validateParams = (
    path: ValidPath,
    params: Record<string, string>
  ): Record<string, string | number> => {
    if (!params || Object.keys(params).length === 0) {
      throw Error("Missing params");
    }

    const assertNever = (x: never): never => {
      throw Error("Unexpected object: " + x);
    };

    switch (path) {
      case "login": {
        if (!VALID_PARAMS.login.source(params.source)) {
          throw Error(`Invalid params: ${JSON.stringify(params)}`);
        }
        return params;
      }
      case "confirm": {
        if (
          !VALID_PARAMS.confirm.source(params.source) ||
          !VALID_PARAMS.confirm.paymentnumber(params.paymentnumber)
        ) {
          throw Error(`Invalid params: ${JSON.stringify(params)}`);
        }
        return {
          ...params,
          paymentnumber: Number(params.paymentnumber),
        };
      }
      case "sign": {
        if (
          !VALID_PARAMS.sign.source(params.source) ||
          !VALID_PARAMS.sign.documentid(params.documentid)
        ) {
          throw Error(`Invalid params: ${JSON.stringify(params)}`);
        }
        return params;
      }
      // Type guard ensures that all arms/paths are covered
      default:
        return assertNever(path);
    }
  };

  #parseUri = (uri: string) => {
    const [scheme, rest] = uri.split("://");
    if (!rest) {
      throw Error(`Invalid uri: ${uri}`);
    }
    const [path, paramsString] = rest.split("?");
    const params = paramsString?.split("&").reduce((acc, param) => {
      const [key, value] = param.split("=");
      return { ...acc, [key]: value ?? "" }; // coalesce empty values to empty string
    }, {} as Record<string, string>);

    return { scheme, path, params };
  };

  #validateURI = (uri: string) => {
    const { scheme, path, params } = this.#parseUri(uri);
    if (!this.#validateScheme(scheme)) {
      throw Error(`Invalid scheme: ${scheme}`);
    }
    if (!this.#validatePath(path)) {
      throw Error(`Invalid path: ${path}`);
    }
    const validatedParams = this.#validateParams(path, params);

    return { scheme, path, params: validatedParams };
  };
}
