import { Server } from 'ws';
// 定义websocket服务器
const wsServer = new Server({ port: 8085 });

// 定义连接到的websocket集合
const socketSet = new Set<any>();

// 连接
wsServer.on('connection', (websocket:any) => {
    socketSet.add(websocket)
});

// 初始化消息数
let message = 0;

// 定时2s发送消息
setInterval(() => {
    socketSet.forEach(ws => {        
        if (ws.readyState == 1) {
            ws.send(JSON.stringify({
                message: message++
            }))
        } else {
            socketSet.delete(ws);
        }
    })
}, 2000)
