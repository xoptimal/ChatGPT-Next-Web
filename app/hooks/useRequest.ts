import { AxiosRequestConfig } from "axios";
import { useState } from "react";
import request from "../utils/api";

export default function useRequest() {
  const [loading, setLoading] = useState(false);

  async function customRequest(url: string, config: AxiosRequestConfig<any>) {
    try {
      setLoading(true);
      const res = await request(url, config);
      return res;
    } catch (error) {
      console.log(error);
      throw error
    } finally {
      setLoading(false);
    }
    return null;
  }

  return { request: customRequest, loading };
}
