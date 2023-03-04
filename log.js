function Log() {}
Log.prototype.debug = function (mg) {
  logger("debug", mg);
};
Log.prototype.info = function (mg) {
  logger("info", mg);
};
Log.prototype.warn = function (mg) {
  logger("warn", mg);
};
Log.prototype.error = function (mg) {
  logger("error", mg);
};

var level = 2;

function logger(lv, mg) {
  var dt = new Date();
  var df = String(dt.getFullYear()) + "/" + String("0" + String(dt.getMonth() + 1)).substr(-2) + "/" + String("0" + String(dt.getDate())).substr(-2);
  df = df + " " + String("0" + String(dt.getHours())).substr(-2) + ":" + String("0" + String(dt.getMinutes())).substr(-2);
  df = df + ":" + String("0" + String(dt.getSeconds())).substr(-2) + "." + String("00" + String(dt.getMilliseconds())).substr(-3);
  var op = "";
  if (lv == "debug") {
    if (level >= 3) op = df + " [DEBUG] " + mg;
  } else if (lv == "info" || lv == "information") {
    if (level >= 2) op = df + " [INFO]  " + mg;
  } else if (lv == "warn" || lv == "warning") {
    if (level >= 1) op = df + " [WARN]  " + mg;
  } else if (lv == "error") {
    if (level >= 0) op = df + " [ERROR] " + mg;
  }
  if (op != "") console.log(op);
}

exports.Log = Log;
