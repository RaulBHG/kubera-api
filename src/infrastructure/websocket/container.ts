import { Container } from "inversify";
import { WebSocketServer } from "./server";
import { WebSocketPort } from "./port";

export const container = new Container();
container.bind<WebSocketPort>(WebSocketServer).toSelf().inSingletonScope();
