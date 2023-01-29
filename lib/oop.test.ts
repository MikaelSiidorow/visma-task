import { describe, it, expect } from "vitest";
import RequestIdentifier from "./oop";

describe("RequestIdentifier", () => {
  it("should parse login URI correctly", () => {
    const uri = "visma-identity://login?source=severa";
    const result = new RequestIdentifier(uri);
    expect(result.path).toEqual("login");
    expect(result.params).toEqual({
      source: "severa",
    });
  });

  it("should parse confirm URI correctly", () => {
    const uri = "visma-identity://confirm?source=netvisor&paymentnumber=102226";
    const result = new RequestIdentifier(uri);
    expect(result.path).toEqual("confirm");
    expect(result.params).toEqual({
      source: "netvisor",
      paymentnumber: 102226,
    });
  });

  it("should parse sign URI correctly", () => {
    const uri = "visma-identity://sign?source=vismasign&documentid=105ab44";
    const result = new RequestIdentifier(uri);
    expect(result.path).toEqual("sign");
    expect(result.params).toEqual({
      source: "vismasign",
      documentid: "105ab44",
    });
  });

  it("should throw error if scheme is invalid", () => {
    const uri = "invalid://sign?source=vismasign&documentid=105ab44";
    expect(() => new RequestIdentifier(uri)).toThrowError(
      "Invalid scheme: invalid"
    );
  });

  it("should throw error if path is invalid", () => {
    const uri = "visma-identity://invalid?source=vismasign&documentid=105ab44";
    expect(() => new RequestIdentifier(uri)).toThrowError(
      "Invalid path: invalid"
    );
  });

  it("should throw error if required parameters are missing", () => {
    const uri = "visma-identity://login";
    expect(() => new RequestIdentifier(uri)).toThrowError("Missing params");
  });

  it("should throw error if required parameters don't have values", () => {
    const uri = "visma-identity://login?source";
    expect(() => new RequestIdentifier(uri)).toThrowError(
      'Invalid params: {"source":""}'
    );
  });

  it("should throw error if paymentnumber is a string", () => {
    const uri = "visma-identity://confirm?source=netvisor&paymentnumber=abc";
    expect(() => new RequestIdentifier(uri)).toThrowError(
      'Invalid params: {"source":"netvisor","paymentnumber":"abc"}'
    );
  });

  it("should throw error if paymentnumber is a float", () => {
    const uri = "visma-identity://confirm?source=netvisor&paymentnumber=10.5";
    expect(() => new RequestIdentifier(uri)).toThrowError(
      'Invalid params: {"source":"netvisor","paymentnumber":"10.5"}'
    );
  });
});
