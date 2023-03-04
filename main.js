var express = require("express");
var exp = express();
var cookie = require("cookie-parser");
var bodyParser = require("body-parser");
var socketIO = require("socket.io");
var Log = require("./log").Log;
var log = new Log();

var dice_data = {};
setTimeout(function () {
  var srv = exp.listen(34580, function () {
    var now = new Date();
    log.info("Start server at " + now.toString());
  });

  var io = socketIO(srv);
  io.sockets.on("connection", function (socket) {
    socket.on("dice", function (data) {
      if (data.count > 1000) data.count = 1000;
      if (data.count < 0) data.count = 0;
      dice_data = data;
      socket.broadcast.emit("dice", data);
    });

    socket.on("dice_roll", function (data) {
      dice_data = data;
      socket.broadcast.emit("dice_roll", data);
    });
  });
}, 1000);

exp.set("view engine", "ejs");
//exp.use(express.cookie - parser());
exp.use(cookie());
exp.use(express.static("public"));
exp.use(bodyParser.json());
exp.use(bodyParser.urlencoded({ extended: true }));
exp.use("/favicon.ico", express.static("/favicon.ico"));

exp.get("/dice", function (req, res, next) {
  res.render("dice", { roomId: undefined, dice: undefined });
});

exp.get("/dice/:rid", function (req, res, next) {
  var rid = req.params.rid;
  res.render("dice", { roomId: rid, dice: dice_data });
});
