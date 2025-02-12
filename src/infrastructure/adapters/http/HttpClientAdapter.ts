import axios, { AxiosInstance } from "axios";
import {
  HttpClientContract,
  HttpResponse,
} from "../../../domain/contracts/HttpClientContract";

export class HttpClientAdapter implements HttpClientContract {
  private readonly axios: AxiosInstance;

  constructor() {
    this.axios = axios.create();
  }

  async httpRequest<T>(
    requestMethod: string,
    requestUrl: string,
    headers: Record<string, string>
  ): Promise<HttpResponse<T>> {
    try {
      const response = await this.axios.request({
        method: requestMethod,
        url: requestUrl,
        headers,
      });

      return {
        data: response.data,
      };
    } catch (error) {
      // You might want to add custom error handling here
      // For example, mapping axios errors to your domain errors
      throw error;
    }
  }
}
