import { WebSocketRouter } from "../router";
import txnsHandlers from "./transaction";

export function setupWebSocketRoutes(router: WebSocketRouter): void {
  router.addRoute(txnsHandlers);
}
