import { WebSocketHandler, WebSocketRouteNamespace } from "../WebsocketContracts";

export class WebSocketRouter {
  private routes: Map<string, WebSocketHandler[]> = new Map();

  public addRoute(route: WebSocketRouteNamespace): void {
    this.routes.set(route.namespace, route.handlers);
  }

  public getHandler(
    namespace: string,
    route: string
  ): WebSocketHandler | undefined {
    const handlers = this.routes.get(namespace);
    return handlers?.find((h) => h.route === route);
  }
}
