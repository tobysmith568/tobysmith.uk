import { singleton } from "tsyringe";
import axios from "axios";

@singleton()
export class HttpService {
  public async postJSON<T>(url: string, body?: any): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      const result = await axios.post<T>(url, body, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8"
        }
      });

      if (result.status >= 400) {
        reject(result.statusText);
        return;
      }

      resolve(result.data);
    });
  }
}
