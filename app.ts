import dotenv from "dotenv";
import { serverInstance } from "./src/infrastructure/server";

dotenv.config();

// # Add Express app routes
serverInstance
  .getExpressApp()
  .use(require("./src/infrastructure/web/routes/api"))
  .use(require("./src/infrastructure/web/routes/webhook"));

// # Start Express app + WS Server
serverInstance.startServer(parseInt(process.env.APP_PORT || "3000"));
