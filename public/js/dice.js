window.onerror = function (ev, sr, ln, cl, er) {
  alert(er.stack);
};
var path = location.pathname;
var room = path.replace("/dice", "").replace(/\//g, "");
var dices = [];

var socket = null;
window.addEventListener("load", function () {
  socket = io.connect("/");

  socket.on("dice", function (data) {
    console.log(data.roomId + " <=> " + room);
    if (data.roomId === room) {
      var elm = document.getElementById("diceCount");
      if (elm) {
        elm.value = Number(data.count || 1);
      }
    }
  });

  socket.on("dice_roll", function (data) {
    console.log(data.roomId + " <=> " + room);
    if (data.roomId === room) {
      var btn = document.getElementById("button");
      diceRoll(false, data.count, data.status === "stop");
      if (data.status === "stop") {
        dices = data.dices;
        for (var i = 0; i < dices.length; i++) {
          var dice = document.getElementById("dice_img_" + i);
          if (dice) dice.setAttribute("src", `/images/${dices[i]}.png`);
        }
        setResult();
      }
    }
  });
});

function validate() {
  var elm = document.getElementById("diceCount");
  if (elm) {
    elm.value = Number(elm.value || 1);
    if (elm.value > 1000) elm.value = 1000;
    if (elm.value < 0) elm.value = 0;
    socket.emit("dice", { count: elm.value, roomId: room });
  }
}

function dice_on_off() {
  var d4 = document.getElementById("D4");
  var disp = d4.style.display === "none" ? "" : "none";
  var other = document.getElementsByName("other");
  for (var d of other) {
    if (d) d.style.display = disp;
  }
}

var max = 1;
var int = null;
function diceRoll(send, count = -1, status = false) {
  var btn = document.getElementById("button");
  var elm = document.getElementById("diceCount");
  var result = document.getElementById("result");
  if (btn.innerText === "転がす" && status === false) {
    if (count >= 0) elm.value = count;
    var cnt = Number(elm.value || 1);
    for (var i = max - 1; i >= 0; i--) {
      var dice = document.getElementById("dice_" + i);
      if (dice) {
        dice.remove();
      }
    }
    var sps = document.getElementById("spacer");
    if (sps) sps.remove();

    var dfd = document.getElementById("diceField");
    for (var i = 0; i < cnt; i++) {
      var div = document.createElement("div");
      div.className = "dice";
      div.id = "dice_" + i;
      var img = document.createElement("img");
      img.setAttribute("src", "/images/1.png");
      img.id = "dice_img_" + i;
      img.width = "60";
      img.height = "60";
      div.append(img);
      dfd.append(div);
    }
    var sps = document.createElement("div");
    sps.className = "spacer";
    sps.id = "spacer";
    dfd.append(sps);

    btn.innerText = "止める";
    int = setInterval(
      function (cnt) {
        dices = roll(cnt);
        for (var i = 0; i < cnt; i++) {
          var dice = document.getElementById("dice_img_" + i);
          if (dice) dice.setAttribute("src", `/images/${dices[i]}.png`);
        }
      },
      50,
      cnt
    );
    max = cnt;
    if (send) socket.emit("dice_roll", { status: "start", count: elm.value, roomId: room });
    if (result) result.innerText = "";
  } else {
    btn.innerText = "転がす";
    if (send) {
      setResult();
      socket.emit("dice_roll", { status: "stop", count: elm.value, dices: dices, roomId: room });
    }
    clearInterval(int);
  }
}

function setResult() {
  var diceR = [0, 0, 0, 0, 0, 0, 0];
  var count = 0;
  console.log(JSON.stringify(dices));
  for (var r of dices) {
    diceR[r]++;
    count += r;
  }
  var resHTML = `<div>合計:${count}</div><div class="container"><div class="row"><div class="col-2">D6</div>`;
  resHTML += '<div class="col"><div class="float-l">';
  for (var i of [1, 2, 3]) {
    resHTML += `<image src="/images/${i}.png" class="small-dice"> ${diceR[i]} `;
  }
  resHTML += '</div><div class="float-l">';
  for (var i of [4, 5, 6]) {
    resHTML += `<image src="/images/${i}.png" class="small-dice"> ${diceR[i]} `;
  }
  resHTML += '<div class="clear"></div>';
  resHTML += "</div></div></div>";
  if (result) result.innerHTML = resHTML;
}

function roll(cnt) {
  var ret = [];
  for (var i = 0; i < cnt; i++) {
    var rnd = Math.floor(Math.random() * 6 + 1);
    ret.push(rnd);
  }
  return ret;
}

function restart(status, dice) {
  setTimeout(
    function (status, dice) {
      console.log(status);
      if (status) {
        if (dice !== undefined) dices = JSON.parse(dice || '{"dices": null}').dices || [];
        diceRoll(false);
      } else if (dice !== undefined) {
        var dfd = document.getElementById("diceField");
        dices = JSON.parse(dice || '{"dices": null}').dices || [];
        for (var i = 0; i < dices.length; i++) {
          var div = document.createElement("div");
          div.className = "dice";
          div.id = "dice_" + i;
          var img = document.createElement("img");
          img.setAttribute("src", `/images/${dices[i]}.png`);
          img.id = "dice_img_" + i;
          img.width = "60";
          img.height = "60";
          div.append(img);
          dfd.append(div);
        }
        max = dices.length;
        setResult();
      }
    },
    50,
    status,
    dice
  );
}
