class WebSocketClient {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.ws = null;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.serverUrl);

    this.ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(`Received: ${JSON.stringify(data, null, 2)}`);
      } catch (e) {
        console.error(`Error parsing message: ${e.message}`);
      }
    };

    this.ws.onerror = (error) => {
      console.error(`WebSocket error: ${error.message}`);
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }

  sendMessage(namespace, type, payload) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

    const message = {
      namespace,
      type,
      payload,
    };

    this.ws.send(JSON.stringify(message));
    console.log(`Sent: ${JSON.stringify(message, null, 2)}`);
  }

  store(budget, steamUser) {
    this.sendMessage("txns", "store", {
      amount: budget,
      currency: "USD",
      steamUser: steamUser,
      timestamp: Date.now(),
    });
  }
}

export default WebSocketClient;
