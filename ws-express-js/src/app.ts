import express from 'express';
import http from 'http';
import WebSocket, { AddressInfo } from 'ws';
import net from 'net';

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws: WebSocket) => {



  //connection is up, let's add a simple simple event
  ws.on('message', (message: string) => {

    //log the received message and send it back to the client
    console.log('received: %s', message);
    ws.send(`Hello, you sent -> ${message}`);
  });

  //send immediatly a feedback to the incoming connection    
  ws.send('Hi there, I am a WebSocket server');
});

// ! authorization part
server.on('upgrade', (request: http.IncomingMessage, socket: net.Socket, head: Buffer) => {

  const url = new URL(request.url!, `http://${request.headers.host}`)
  const token = url.searchParams.get('token')
  if (token) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request)
    })
  } else {
    socket.destroy()
  }


})


//start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${(server.address() as AddressInfo).port} :)`);
});