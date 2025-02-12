export interface HttpResponse<T = any> {
  data: any;
}

export interface HttpClientContract {
  httpRequest<T>(
    requestMethod: string,
    requestUrl: string,
    headers: Record<string, string>
  ): Promise<HttpResponse<T>>;
}
