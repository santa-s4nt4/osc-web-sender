document.addEventListener('DOMContentLoaded', () => {
  let ws = null;
  const serverIpInput = document.getElementById('serverIp');
  const connectButton = document.getElementById('connectButton');
  const oscSection = document.getElementById('oscSection');
  const statusDiv = document.getElementById('status');
  // (他のUI要素の取得は省略)

  connectButton.addEventListener('click', () => {
    const serverIp = serverIpInput.value;
    if (!serverIp) {
      alert('Please enter the Server IP Address.');
      return;
    }
    if (ws) {
      ws.close();
    }

    statusDiv.textContent = `Connecting to ${serverIp}...`;
    statusDiv.className = 'text-sm font-medium mb-4 p-3 rounded-lg text-center bg-yellow-100 text-yellow-800';

    // ★★★ 変更点： 'ws://' から 'wss://' に変更 ★★★
    ws = new WebSocket(`wss://${serverIp}:8080`);

    addWebSocketHandlers();
  });

  function addWebSocketHandlers() {
    ws.onopen = () => {
      console.log('Secure server connected.');
      statusDiv.textContent = `✅ Securely connected to ${ws.url}`;
      statusDiv.className = 'text-sm font-medium mb-4 p-3 rounded-lg text-center bg-green-100 text-green-800';
      oscSection.disabled = false;
    };

    ws.onclose = () => {
      console.log('Server disconnected.');
      statusDiv.textContent = '❌ Disconnected. Please connect to a server.';
      statusDiv.className = 'text-sm font-medium mb-4 p-3 rounded-lg text-center bg-red-100 text-red-800';
      oscSection.disabled = true;
      ws = null;
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      statusDiv.textContent = `❌ Connection failed. Did you trust the certificate?`;
      statusDiv.className = 'text-sm font-medium mb-4 p-3 rounded-lg text-center bg-red-100 text-red-800';
      oscSection.disabled = true;
      ws = null;
    };
  }

  // (sendButtonのイベントリスナーは変更なし)
  const sendButton = document.getElementById('sendButton');
  sendButton.addEventListener('click', () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      alert('Not connected to the server.');
      return;
    }
    // (送信ロジックは省略)
    const valueInput = document.getElementById('value');
    const ipInput = document.getElementById('ip');
    const portInput = document.getElementById('port');
    const addressInput = document.getElementById('address');
    const rawValue = valueInput.value;
    const valueToSend = !isNaN(parseFloat(rawValue)) && isFinite(rawValue) ? parseFloat(rawValue) : rawValue;
    const data = {
      ip: ipInput.value,
      port: parseInt(portInput.value, 10),
      address: addressInput.value,
      value: valueToSend,
    };
    ws.send(JSON.stringify(data));
    console.log('Sent to server:', data);
  });
});
