const express = require('express');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;

// 使用 Express 静态文件中间件提供静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 启动 HTTP 服务器
const server = app.listen(PORT, () => {
    console.log(`HTTP 服务器已启动，访问地址：http://localhost:${PORT}`);
});

// 启动 WebSocket 服务器
const wss = new WebSocket.Server({ server });

wss.on('connection', socket => {
    console.log('客户端连接已建立');

    socket.on('message', message => {
        console.log('收到消息：', message.toString()); // message 是 buffer，转 toString 解析正确结果
        const data = JSON.parse(message);
        console.log(data)
        wss.clients.forEach(client => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });

    socket.on('close', () => {
        console.log('客户端连接已关闭');
    });

    socket.on('error', error => {
        console.error('WebSocket 发生错误：', error);
    });
});

console.log('WebSocket 服务器已启动，端口3000');
