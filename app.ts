import dotenv from "dotenv";
import { ServerInstance } from "./src/infrastructure/shared/server/index";

const diContainer = require("./src/infrastructure/shared/DIContainer");

dotenv.config();

// # Initialize server instance with DI container
const serverInstance = ServerInstance.initialize(diContainer);

// # Add Express app routes
serverInstance
  .getExpressApp()
  .use(require("./src/infrastructure/shared/web/routes/api/router"))
  .use(require("./src/infrastructure/shared/web/routes/webhook/router"));

serverInstance
  .getWebSocketServer()
  .getRouter()
  .addRoute(
    require("./src/infrastructure/shared/websocket/routes/txns").default
  );

// # Start Express app + WS Server
serverInstance.startServer(parseInt(process.env.APP_PORT || "3000"));
