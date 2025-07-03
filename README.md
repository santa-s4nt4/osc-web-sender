# Web OSC Sender

ブラウザからローカルネットワーク上の任意のIPアドレスにOSC (Open Sound Control) メッセージを送信するためのシンプルなWebアプリケーションです。

AndroidやPCのブラウザを、TouchDesigner, Max/MSP, VRChatなどのOSC対応アプリケーションを操作するための柔軟なリモコンとして利用できます。

## ✨ 主な機能

- **動的な接続先**: 中継サーバーのIPアドレスと、OSCの送信先IPアドレスをブラウザ上で自由に設定可能。
- **柔軟なメッセージ**: 任意のOSCアドレスに対し、数値またはテキスト（文字列）を送信できます。
- **シンプルな構成**: 3つのファイル（HTML, JavaScript, Node.jsサーバー）だけで動作します。
- **セットアップ不要**: GitHub Pagesなどにデプロイすれば、どのデバイスのブラウザからでもアクセス可能です。

## ⚙️ 仕組み

ブラウザはセキュリティ上、直接OSC (UDP) を送信できません。そのため、このアプリケーションはPC上で動作する小さな「中継サーバー」を介してOSCメッセージを送信します。

**通信の流れ:**
`ブラウザ` → `WebSocket` → `Node.js 中継サーバー` → `UDP (OSC)` → `OSC受信アプリケーション`

## 必要なもの

- [Node.js](https://nodejs.org/) (v14以上を推奨): 中継サーバー(`server.js`)を実行するために必要です。

## 🚀 使い方

### 1. セットアップ

まず、中継サーバーを動かすPCで以下の準備をします。

```bash
# 1. このプロジェクトのファイルをダウンロードまたはクローンします。
# git clone https://...

# 2. プロジェクトフォルダに移動します。
# cd path/to/project

# 3. 必要なライブラリをインストールします。
npm install ws node-osc
```

### 2. 中継サーバーの起動
OSCを中継したいPCのターミナル（コマンドプロンプトなど）で、以下のコマンドを実行します。

node server.js
```🚀 OSC Relay Server has started!` と表示されれば、サーバーは正常に起動しています。
このとき、PCのファイアウォールがポート `8080` への接続をブロックしないように注意してください。


### 3. ブラウザからの操作

1.  **Webページを開く**: `index.html` ファイルをブラウザで開きます。（または、GitHub PagesなどにデプロイしたURLにアクセスします）
2.  **サーバーに接続**:
    - `Server IP Address` の欄に、ステップ2で `server.js` を実行しているPCのIPアドレスを入力します。
    - `Connect` ボタンを押します。
    - ステータスが `✅ Connected` になれば成功です。
3.  **OSCを送信**:
    - `Destination IP`, `Port`, `OSC Address`, `Value` を設定します。
    - `Send OSC` ボタンを押すと、メッセージが送信されます。

## 📂 ファイル構成

-   **`index.html`**: ブラウザに表示されるUI（ユーザーインターフェース）です。
-   **`main.js`**: ブラウザ側の処理を担当するJavaScriptです。UIの操作、WebSocketによるサーバーとの通信などを行います。
-   **`server.js`**: Node.jsで動作する中継サーバーです。ブラウザからWebSocketで受信した指示に基づき、OSCメッセージを生成して送信します。

## 📄 ライセンス

このプロジェクトは [MIT License](https://opensource.org/licenses/MIT) の下で公開されています。
