import axios, { AxiosInstance } from "axios";
import {
  ScrapingHttpClientContract,
  ScrapingHttpResponse,
} from "../../../domain/contracts/ScrapingHttpClientContract";

export class ScrapingHttpClientAdapter implements ScrapingHttpClientContract {
  private readonly axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: process.env.TLS_CLIENT_API_DNS,
      headers: {
        "x-api-key": process.env.TLS_CLIENT_API_AUTH_KEY,
      },
      validateStatus: () => true,
    });
  }

  async enchancedHttpRequest<T>(
    requestMethod: string,
    requestUrl: string,
    tlsClientIdentifier: string,
    headers?: Record<string, string>
  ): Promise<ScrapingHttpResponse<T>> {
    return await this.axios.post("/api/forward", {
      requestMethod,
      requestUrl,
      tlsClientIdentifier,
      headers,
    });
  }
}
