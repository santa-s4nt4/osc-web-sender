// 必要なライブラリを読み込む
const https = require('https'); // HTTPSサーバー用
const fs = require('fs');       // ファイルシステム用 (今回は直接は使わないが、一般的な構成として)
const WebSocket = require('ws'); // WebSocketサーバー用
const osc = require('node-osc');   // OSC送信用
const selfsigned = require('selfsigned'); // 自己署名証明書ジェネレーター

console.log('===========================================');
console.log('🚀 OSC Relay Server (Secure WSS) Starting...');

// 1. 自己署名SSL証明書の生成
// サーバー起動時に毎回新しい証明書を生成します。
const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, {
  keySize: 2048, // keysize
  days: 365,     // 1年間有効
  algorithm: 'sha256',
});

// 2. HTTPSサーバーのオプションを設定
const httpsOptions = {
  key: pems.private,
  cert: pems.cert,
};

// 3. HTTPSサーバーを作成
const server = https.createServer(httpsOptions, (req, res) => {
  // WebSocket以外の通常のHTTPリクエストへの応答
  // (今回は特に何もしないが、サーバーが動いているか確認するためにメッセージを返す)
  res.writeHead(200);
  res.end('WebSocket Secure Server is running. Please connect via WSS.');
});

// 4. WebSocketサーバーをHTTPSサーバーにアタッチする
const wss = new WebSocket.Server({ server });

// サーバーがポート8080でリッスンを開始したときの処理
server.listen(8080, () => {
  console.log('✅ Server is listening on: https://<Your_PC_IP>:8080');
  console.log('✅ WebSocket is listening on: wss://<Your_PC_IP>:8080');
  console.log('===========================================');
});


// --- WebSocketのイベントハンドラ (ここから下は以前と同じ) ---

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`✅ Client connected from: ${clientIp}`);

  ws.on('message', message => {
    try {
      const data = JSON.parse(message);
      console.log('Received from browser:', data);
      const { ip, port, address, value } = data;

      if (!ip || !port || !address || value === undefined) {
        console.error('❌ Invalid data received.');
        return;
      }

      const client = new osc.Client(ip, port);
      client.send(address, value, (err) => {
        if (err) {
          console.error('❌ Error sending OSC message:', err);
        } else {
          console.log(`✅ OSC message sent: ${address} ${value} to ${ip}:${port}`);
        }
        client.close();
      });
    } catch (e) {
      console.error('❌ Failed to process message:', e);
    }
  });

  ws.on('close', () => {
    console.log(`👋 Client from ${clientIp} disconnected.`);
  });
});
