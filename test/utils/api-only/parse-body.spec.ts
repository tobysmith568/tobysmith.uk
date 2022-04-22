import { NextApiRequest } from "next";
import { BadRequestException } from "next-api-handler";
import { z } from "zod";
import parseBody from "../../../src/utils/api-only/parse-body";

const validator = z.object({
  stringField: z.string(),
  numberField: z.number(),
  booleanField: z.boolean()
});

type ValidatedType = z.infer<typeof validator>;

describe("parse-body", () => {
  it("should return a valid body", () => {
    const input: ValidatedType = {
      stringField: "string",
      numberField: 1,
      booleanField: true
    };

    const req = {
      body: input
    } as NextApiRequest;

    const result = parseBody(req, validator);

    expect(result).toStrictEqual(input);
  });

  describe("with an undefined body", () => {
    it("should throw a BadRequestException", () => {
      const input: ValidatedType = undefined as unknown as ValidatedType;

      const req = {
        body: input
      } as NextApiRequest;

      expect(() => parseBody(req, validator)).toThrowError(BadRequestException);
    });

    it("should throw with a descriptive message", () => {
      const input: ValidatedType = undefined as unknown as ValidatedType;

      const req = {
        body: input
      } as NextApiRequest;

      expect(() => parseBody(req, validator)).toThrowError("Form: Required");
    });
  });

  describe("with an empty body", () => {
    it("should throw a BadRequestException", () => {
      const input: ValidatedType = {} as unknown as ValidatedType;

      const req = {
        body: input
      } as NextApiRequest;

      expect(() => parseBody(req, validator)).toThrowError(BadRequestException);
    });

    it("should throw with a descriptive message", () => {
      const input: ValidatedType = {} as unknown as ValidatedType;

      const req = {
        body: input
      } as NextApiRequest;

      expect(() => parseBody(req, validator)).toThrowError(
        "Field 'stringField': Required. Field 'numberField': Required. Field 'booleanField': Required"
      );
    });
  });

  describe("with an invalid string field", () => {
    it("should throw a BadRequestException", () => {
      const input: ValidatedType = {
        stringField: 5 as unknown as string,
        numberField: 1,
        booleanField: true
      };

      const req = {
        body: input
      } as NextApiRequest;

      expect(() => parseBody(req, validator)).toThrowError(BadRequestException);
    });

    it("should throw with a descriptive message", () => {
      const input: ValidatedType = {
        stringField: 5 as unknown as string,
        numberField: 1,
        booleanField: true
      };

      const req = {
        body: input
      } as NextApiRequest;

      expect(() => parseBody(req, validator)).toThrowError(
        "Field 'stringField': Expected string, received number"
      );
    });
  });

  describe("with an invalid number field", () => {
    it("should throw a BadRequestException", () => {
      const input: ValidatedType = {
        stringField: "string",
        numberField: "1" as unknown as number,
        booleanField: true
      };

      const req = {
        body: input
      } as NextApiRequest;

      expect(() => parseBody(req, validator)).toThrowError(BadRequestException);
    });

    it("should throw with a descriptive message", () => {
      const input: ValidatedType = {
        stringField: "string",
        numberField: "1" as unknown as number,
        booleanField: true
      };

      const req = {
        body: input
      } as NextApiRequest;

      expect(() => parseBody(req, validator)).toThrowError(
        "Field 'numberField': Expected number, received string"
      );
    });
  });

  describe("with an invalid boolean field", () => {
    it("should throw a BadRequestException", () => {
      const input: ValidatedType = {
        stringField: "string",
        numberField: 1,
        booleanField: "true" as unknown as boolean
      };

      const req = {
        body: input
      } as NextApiRequest;

      expect(() => parseBody(req, validator)).toThrowError(BadRequestException);
    });

    it("should throw with a descriptive message", () => {
      const input: ValidatedType = {
        stringField: "string",
        numberField: 1,
        booleanField: "true" as unknown as boolean
      };

      const req = {
        body: input
      } as NextApiRequest;

      expect(() => parseBody(req, validator)).toThrowError(
        "Field 'booleanField': Expected boolean, received string"
      );
    });
  });
});
