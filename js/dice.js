window.onerror = function (ev, sr, ln, cl, er) {
  alert(er.stack);
};

function validate() {
  var elm = document.getElementById("diceCount");
  if (elm) {
    elm.value = Number(elm.value || 1);
    if (elm.value <= 0) elm.value = 1;
  }
}

var max = 1;
var int = null;
function diceRoll() {
  var btn = document.getElementById("button");
  var elm = document.getElementById("diceCount");
  if (btn.innerText == "転がす") {
    var cnt = Number(elm.value || 1);
    for (var i = max - 1; i >= 0; i--) {
      var dice = document.getElementById("dice_" + i);
      if (dice) dice.remove();
    }

    var dfd = document.getElementById("diceField");
    for (var i = 0; i < cnt; i++) {
      var div = document.createElement("div");
      div.className = "dice";
      div.id = "dice_" + i;
      var img = document.createElement("img");
      img.setAttribute("src", "./images/1.png");
      img.id = "dice_img_" + i;
      img.width = "60";
      img.height = "60";
      div.append(img);
      dfd.append(div);
    }

    btn.innerText = "止める";
    int = setInterval(
      function (cnt) {
        var ret = roll(cnt);
        for (var i = 0; i < cnt; i++) {
          var dice = document.getElementById("dice_img_" + i);
          if (dice) dice.setAttribute("src", `./images/${ret[i]}.png`);
        }
      },
      50,
      cnt
    );
    max = cnt;
  } else {
    btn.innerText = "転がす";
    clearInterval(int);
  }
}

function roll(cnt) {
  var ret = [];
  for (var i = 0; i < cnt; i++) {
    var rnd = Math.floor(Math.random() * 6 + 1);
    ret.push(rnd);
  }
  return ret;
}
