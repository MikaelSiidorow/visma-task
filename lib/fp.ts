import type { ValidPath, ValidScheme } from "./types";
import { VALID_PARAMS, VALID_PATHS, VALID_SCHEMES } from "./types";

const validateScheme = (scheme: string): scheme is ValidScheme =>
  VALID_SCHEMES.includes(scheme as ValidScheme);

const validatePath = (path: string): path is ValidPath =>
  VALID_PATHS.includes(path as ValidPath);

const validateParams = (
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
    default:
      // Type guard ensures that all arms/paths are covered
      return assertNever(path);
  }
};

/**
 * Parses a URI into scheme, path and params
 *
 * @param uri
 * @returns an object containing scheme (e.g. "visma-identity"),
 *  path (e.g. "login") and params (e.g. { source: "severa" })
 * @throws Error if URI is missing a path after the scheme
 */
const parseURI = (uri: string) => {
  const [scheme, rest] = uri.split("://");
  if (!rest) {
    throw Error(`Invalid URI (missing path): ${uri}`);
  }
  const [path, paramsString] = rest.split("?");
  const params = paramsString?.split("&").reduce((acc, param) => {
    const [key, value] = param.split("=");
    return { ...acc, [key]: value ?? "" }; // coalesce empty values to empty string
  }, {} as Record<string, string>);

  return { scheme, path, params };
};

/**
 * Identify request from URI and validate it against known schemes, paths and params
 *
 * @param uri
 * @throws Error if scheme, path or params are invalid
 * @returns Validated URI object with original uri, scheme, path and params
 */
const validateURI = (uri: string) => {
  const { scheme, path, params } = parseURI(uri);

  if (!validateScheme(scheme)) {
    throw Error(`Invalid scheme: ${scheme}`);
  }

  if (!validatePath(path)) {
    throw Error(`Invalid path: ${path}`);
  }

  const validatedParams = validateParams(path, params);

  return { path, params: validatedParams };
};

export default validateURI;
