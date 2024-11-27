const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = function (event) {
  const customEvent = new CustomEvent('wsMessage', { detail: event.data });
  window.dispatchEvent(customEvent);
};

export { ws };