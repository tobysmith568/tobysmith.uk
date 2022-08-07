import axios from "axios";
import { postJSON } from "../../src/utils/http-request";

jest.mock("axios");

describe("http request", () => {
  const mockedAxiosPost = jest.mocked(axios.post);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("postJSON", () => {
    beforeEach(() => {
      mockedAxiosPost.mockResolvedValue({
        status: 200,
        data: {}
      });
    });

    it("should call the axios post method once", async () => {
      await postJSON("/anything", {});

      expect(mockedAxiosPost).toHaveBeenCalledTimes(1);
    });

    ["https://some.random/url/", "a/relative/path"].forEach(url =>
      it(`should call the axios post method with the given url: ${url}`, async () => {
        await postJSON(url, {});

        expect(mockedAxiosPost).toHaveBeenCalledWith(url, expect.anything(), expect.anything());
      })
    );

    ["just a string", { aKey: "aValue" }].forEach(body =>
      it(`should call the axios post method with the given body: ${JSON.stringify(
        body
      )}`, async () => {
        await postJSON("/anything", body);

        expect(mockedAxiosPost).toHaveBeenCalledWith(expect.anything(), body, expect.anything());
      })
    );

    it("should use the application/json accept header", async () => {
      await postJSON("/anything", {});

      expect(mockedAxiosPost).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: "application/json"
          })
        })
      );
    });

    it("should use the application/json;charset=UTF-8 Content-Type header", async () => {
      await postJSON("/anything", {});

      expect(mockedAxiosPost).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json;charset=UTF-8"
          })
        })
      );
    });

    [400, 401, 403, 404, 500, 501].forEach(statusCode =>
      it(`should throw the axios result if the status is greater or equal to 400: ${statusCode}`, async () => {
        const axiosResult = {
          status: statusCode,
          data: { someError: "message" }
        };

        mockedAxiosPost.mockResolvedValue(axiosResult);

        await expect(postJSON("/anything", {})).rejects.toEqual(axiosResult);
      })
    );

    [200, 201, 204, 301, 304].forEach(statusCode =>
      it(`should resolve the data key if the status is less than 400: ${statusCode}`, async () => {
        const axiosResult = {
          status: statusCode,
          data: { some: "message" }
        };

        mockedAxiosPost.mockResolvedValue(axiosResult);

        const result = await postJSON("/anything", {});

        expect(result).toBe(axiosResult.data);
      })
    );
  });
});
