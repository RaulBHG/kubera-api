import axios, { AxiosInstance } from "axios";
export class HttpClientAdapter {
  private readonly axios: AxiosInstance;

  constructor() {
    this.axios = axios.create();
  }

  async httpRequest(
    requestMethod: string,
    requestUrl: string,
    headers: Record<string, string>
  ): Promise<any> {
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
