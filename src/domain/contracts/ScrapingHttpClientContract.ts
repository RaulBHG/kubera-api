export interface ScrapingHttpResponse<T> {
  //@ts-ignore
  data;
}

export interface ScrapingHttpClientContract {
  enchancedHttpRequest<T>(
    requestMethod: string,
    requestUrl: string,
    tlsClientIdentifier: string,
    headers: Record<string, string>
  ): Promise<ScrapingHttpResponse<T>>;
}
