import { WebSocketRouter } from "../router";
import txnRoutes from "./txns";

export function setupWebSocketRoutes(router: WebSocketRouter): void {
  router.addRoute(txnRoutes);
}
