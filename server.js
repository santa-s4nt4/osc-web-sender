// 必要なライブラリを読み込む
const WebSocket = require('ws'); // WebSocketサーバー用
const osc = require('node-osc');   // OSC送信用

// WebSocketサーバーをポート8080で起動
const wss = new WebSocket.Server({ port: 8080 });

console.log('===========================================');
console.log('🚀 OSC Relay Server has started!');
console.log('Listening on: ws://localhost:8080');
console.log('Please open the index.html file in your browser.');
console.log('===========================================');


// ブラウザ（クライアント）からの接続があったときの処理
wss.on('connection', ws => {
  console.log('✅ Browser connected.');

  // ブラウザからメッセージを受信したときの処理
  ws.on('message', message => {
    try {
      // 受信したJSON文字列をオブジェクトに変換
      const data = JSON.parse(message);
      console.log('Received from browser:', data);

      const { ip, port, address, value } = data;

      // 必要な情報が揃っているか確認
      if (!ip || !port || !address || value === undefined) {
        console.error('❌ Invalid data received from browser.');
        return;
      }

      // OSCクライアントを作成し、指定されたIPとポートにメッセージを送信
      const client = new osc.Client(ip, port);
      client.send(address, value, (err) => {
        if (err) {
          console.error('❌ Error sending OSC message:', err);
        } else {
          console.log(`✅ OSC message sent: Address=${address}, Value=${value} to ${ip}:${port}`);
        }
        // 送信後にクライアントを閉じる（リソースを解放）
        client.close();
      });

    } catch (e) {
      console.error('❌ Failed to process message:', e);
    }
  });

  // ブラウザとの接続が切れたときの処理
  ws.on('close', () => {
    console.log('👋 Browser disconnected.');
  });
});

// サーバーエラーの処理
wss.on('error', (error) => {
  console.error('💥 Server error:', error);
});
