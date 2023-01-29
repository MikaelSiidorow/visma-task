export const VALID_SCHEMES = ["visma-identity"] as const;
export const VALID_PATHS = ["login", "confirm", "sign"] as const;
export const VALID_PARAMS = {
  login: {
    source: (value: string) => value.length > 0,
  },
  confirm: {
    source: (value: string) => value.length > 0,
    paymentnumber: (value: unknown): value is number =>
      Number(value) > 0 && Number.isInteger(Number(value)),
  },
  sign: {
    source: (value: string) => value.length > 0,
    documentid: (value: string) => value.length > 0,
  },
} as const;

export type ValidScheme = typeof VALID_SCHEMES[number];
export type ValidPath = typeof VALID_PATHS[number];
