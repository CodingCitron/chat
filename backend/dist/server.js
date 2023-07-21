"use strict";

var _http = _interopRequireDefault(require("http"));
var _ws = _interopRequireDefault(require("ws"));
var _express = _interopRequireDefault(require("express"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _cors = _interopRequireDefault(require("cors"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_dotenv["default"].config({
  path: _path["default"].join(__dirname, '..', '.env')
});
var app = (0, _express["default"])();
var port = 3000;

// app.set('')
app.use(_express["default"]["static"]("public")); // public 폴더 사용
var origin = "http://localhost:".concat(port);
app.use((0, _cors["default"])({
  origin: origin,
  credentials: true
}));
app.use(_express["default"].json()); // json 형태로 오는 요청의 본문을 해석해줄 수 있게 등록
app.use(_express["default"].urlencoded({
  extended: true
})); // form 방식일때

var server = _http["default"].createServer(app);
var wss = new _ws["default"].Server({
  server: server
});
var sockets = [];
server.listen(port, function () {
  return console.log("Listen on ".concat(origin));
});
wss.on('connection', function (socket) {
  sockets.push(socket);
  socket.send('welcome to chat!');
  socket.send('hello!!!');
  socket.on('message', function (message) {
    sockets.forEach(function (otherSocket) {
      return otherSocket.send(message.toString());
    });
  });
  socket.on('close', function () {
    console.log('Disconnected from the Browser');
  });
});

// 바벨과 타입스크립트 충돌
// https://hoontae24.github.io/9