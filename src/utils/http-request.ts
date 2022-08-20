import axios, { AxiosResponse } from "axios";

export const postJSON = async <TReq, TRes>(url: string, body: TReq): Promise<TRes> => {
  const result = await axios.post<TRes, AxiosResponse<TRes, TReq>, TReq>(url, body, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8"
    }
  });

  if (result.status >= 400) {
    throw result;
  }

  return result.data;
};
