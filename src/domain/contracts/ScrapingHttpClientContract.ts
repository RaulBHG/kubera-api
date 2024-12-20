// TODO: evitar any
export interface ScrapingHttpResponse<T = any> {
  data: any;
}

export interface ScrapingHttpClientContract {
  enchancedHttpRequest<T>(
    requestMethod: string,
    requestUrl: string,
    tlsClientIdentifier: string,
    headers: Record<string, string>
  ): Promise<ScrapingHttpResponse<T>>;
}
