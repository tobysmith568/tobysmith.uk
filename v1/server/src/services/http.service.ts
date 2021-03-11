import { default as axios } from "axios";

export class HttpService {

  public async get(url: string): Promise<object | undefined> {
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "PostmanRuntime/7.22.0"
        }
      });
      return response.data;
    } catch (e) {
      return undefined;
    }
  }
}
