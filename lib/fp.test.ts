import { describe, it, expect } from "vitest";
import identifyRequest from "./fp";

describe("identifyRequest", () => {
  it("should parse login URI correctly", () => {
    const uri = "visma-identity://login?source=severa";
    const result = identifyRequest(uri);
    expect(result).toEqual({
      path: "login",
      params: {
        source: "severa",
      },
    });
  });

  it("should parse confirm URI correctly", () => {
    const uri = "visma-identity://confirm?source=netvisor&paymentnumber=102226";
    const result = identifyRequest(uri);
    expect(result).toEqual({
      path: "confirm",
      params: {
        source: "netvisor",
        paymentnumber: 102226,
      },
    });
  });

  it("should parse sign URI correctly", () => {
    const uri = "visma-identity://sign?source=vismasign&documentid=105ab44";
    const result = identifyRequest(uri);
    expect(result).toEqual({
      path: "sign",
      params: {
        source: "vismasign",
        documentid: "105ab44",
      },
    });
  });

  it("should throw error if scheme is invalid", () => {
    const uri = "invalid://sign?source=vismasign&documentid=105ab44";
    expect(() => identifyRequest(uri)).toThrowError("Invalid scheme: invalid");
  });

  it("should throw error if path is invalid", () => {
    const uri = "visma-identity://invalid?source=vismasign&documentid=105ab44";
    expect(() => identifyRequest(uri)).toThrowError("Invalid path: invalid");
  });

  it("should throw error if required parameters are missing", () => {
    const uri = "visma-identity://login";
    expect(() => identifyRequest(uri)).toThrowError("Missing params");
  });

  it("should throw error if required parameters don't have values", () => {
    const uri = "visma-identity://login?source";
    expect(() => identifyRequest(uri)).toThrowError(
      'Invalid params: {"source":""}'
    );
  });

  it("should throw error if paymentnumber is a string", () => {
    const uri = "visma-identity://confirm?source=netvisor&paymentnumber=abc";
    expect(() => identifyRequest(uri)).toThrowError(
      'Invalid params: {"source":"netvisor","paymentnumber":"abc"}'
    );
  });

  it("should throw error if paymentnumber is a float", () => {
    const uri = "visma-identity://confirm?source=netvisor&paymentnumber=10.5";
    expect(() => identifyRequest(uri)).toThrowError(
      'Invalid params: {"source":"netvisor","paymentnumber":"10.5"}'
    );
  });
});
