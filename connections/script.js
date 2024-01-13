getDate();
let categories = [];
let wordList = [];
let order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
let complete = [0, 0, 0, 0];
let selected = [];
let lives = 4;
let rows = 0;
let colours = ["#FBD400", "#B5E352", "#729EEB", "#BC70C4"];
var words = document.getElementsByClassName("w");
for (let i = 0; i < words.length; i++) {
  words[i].addEventListener("mousedown", function () {
    select(words[i]);
  });
  words[i].addEventListener("mouseup", function () {
    onMouseUp(words[i]);
  });
  words[i].addEventListener("mouseleave", function () {
    onMouseUp(words[i]);
  });
}
let board = [];

// add event listeners
document.getElementById("shuffle").addEventListener("mousedown", function () {
  toolMouseDown(document.getElementById("shuffle"));
  shuffle();
});
document.getElementById("deselect").addEventListener("mousedown", function () {
  toolMouseDown(document.getElementById("deselect"));
  deselect();
});
document.getElementById("submit").addEventListener("mousedown", function () {
  toolMouseDown(document.getElementById("submit"));
  submit();
});
document.getElementById("shuffle").addEventListener("mouseup", function () {
  toolMouseUp(document.getElementById("shuffle"));
});
document.getElementById("deselect").addEventListener("mouseup", function () {
  toolMouseUp(document.getElementById("deselect"));
});
document.getElementById("submit").addEventListener("mouseup", function () {
  toolMouseUp(document.getElementById("submit"));
});
document.getElementById("shuffle").addEventListener("mouseleave", function () {
  toolMouseUp(document.getElementById("shuffle"));
});
document.getElementById("deselect").addEventListener("mouseleave", function () {
  toolMouseUp(document.getElementById("deselect"));
});
document.getElementById("submit").addEventListener("mouseleave", function () {
  toolMouseUp(document.getElementById("submit"));
});

// select game
let g = getGames();
let len = g.length;
// document.getElementById("title2").innerHTML += "AAA";
let rand = Math.floor(len * Math.random());
categories = g[rand].categories.map((x) => x.toUpperCase());
wordList = g[rand].wordList.map((x) => x.toUpperCase());

// display game
function play() {
  let introList = document.getElementsByClassName("intro");
  for (let i = 0; i < introList.length; i++) {
    introList[i].remove();
  }
  shuffle();
  reset();
  for (let i = 0; i < words.length; i++) {
    words[i].style.position = "relative";
    words[i].style.zIndex = "1";
  }
}

// shuffle tiles
function shuffle() {
  let selectedWords = [];
  for (let i in selected) {
    let word = selected[i].innerHTML;
    selectedWords.push(word);
  }
  for (let i = 15; i >= 4 * rows; i--) {
    let swap = Math.floor(Math.random() * (i + 1 - 4 * rows)) + 4 * rows;
    if (swap >= 4 * rows) {
      temp = order[swap];
      order[swap] = order[i];
      order[i] = temp;
    }
  }
  for (let i = 4 * rows; i < 16; i++) {
    let swap = Math.floor(Math.random() * (16 - i)) + 4 * rows;
    if (swap >= 4 * rows) {
      temp = order[swap];
      order[swap] = order[i];
      order[i] = temp;
    }
  }
  for (let i = 0; i < 16; i++) {
    document.getElementById("b" + order[i]).innerHTML = wordList[i];
  }
  // rearrange selected tiles
  reset();
  selected = [];
  for (let i in selectedWords) {
    selected.push(
      document.getElementById("b" + order[wordList.indexOf(selectedWords[i])])
    );
    document.getElementById(
      "b" + order[wordList.indexOf(selectedWords[i])]
    ).style.backgroundColor = "#5A594E";
    document.getElementById(
      "b" + order[wordList.indexOf(selectedWords[i])]
    ).style.color = "#ffffff";
  }
}

// select tile
function select(wButton) {
  wButton.style.width = "90%";
  wButton.style.height = "90%";
  if (
    wButton.style.backgroundColor == "rgb(239, 239, 230)" &&
    selected.length < 4
  ) {
    if (selected.length == 3) {
      submitOn();
    }
    wButton.style.backgroundColor = "#5A594E";
    wButton.style.color = "#ffffff";
    selected.push(wButton);
  } else {
    wButton.style.backgroundColor = "rgb(239, 239, 230)";
    wButton.style.color = "#000000";
    let a = selected.indexOf(wButton);
    if (a > -1) {
      selected.splice(a, 1);
      submitOff();
    }
  }
}

// reset tile size
function onMouseUp(wButton) {
  wButton.style.width = "100%";
  wButton.style.height = "100%";
}

// deselect all tiles
function deselect() {
  if (selected.length == 4) {
    submitOff();
  }
  for (let i = selected.length - 1; i >= 0; i--) {
    selected[i].style.backgroundColor = "rgb(239, 239, 230)";
    selected[i].style.color = "#000000";
    selected.splice(i, 1);
  }
}

function toolMouseDown(wButton) {
  if (wButton.innerHTML != "Submit" || selected.length == 4) {
    wButton.style.backgroundColor = "#E2E2E2";
  }
}

function toolMouseUp(wButton) {
  wButton.style.backgroundColor = "#ffffff";
}

// submit if 4 tiles selected
function submit() {
  if (selected.length == 4) {
    selected.sort((a, b) =>
      parseInt(a.innerHTML) > parseInt(b.innerHTML) ? 1 : -1
    );
    let entry = [];
    for (let i in selected) {
      entry.push(wordList.indexOf(selected[i].innerHTML));
    }
    if (board.includes(entry)) {
      notification("Already guessed!");
      return;
    }
    board.push(entry);

    selected.sort((a, b) =>
      parseInt(a.id.substring(1)) > parseInt(b.id.substring(1)) ? 1 : -1
    );
    for (let i in selected) {
      let move = [
        { transform: "translateY(0px)" },
        { transform: "translateY(-6px)" },
        { transform: "translateY(0px)" },
      ];
      selected[i].animate(move, { duration: 300, delay: 150 * i });
    }
    if (
      Math.floor(wordList.indexOf(selected[0].innerHTML) / 4) ==
        Math.floor(wordList.indexOf(selected[1].innerHTML) / 4) &&
      Math.floor(wordList.indexOf(selected[1].innerHTML) / 4) ==
        Math.floor(wordList.indexOf(selected[2].innerHTML) / 4) &&
      Math.floor(wordList.indexOf(selected[2].innerHTML) / 4) ==
        Math.floor(wordList.indexOf(selected[3].innerHTML) / 4)
    ) {
      setTimeout(() => {
        correct();
      }, 750);
    } else {
      wrong();
    }
  }
}

// show notification
function notification(text) {
  document.getElementById("notification").innerHTML = text;
  selected[i].animate(
    [{ transform: "opacity(0)" }, { transform: "opacity(1)" }],
    { duration: 50, delay: 0 }
  );
  setTimeout(() => {
    document.getElementById("notification").style.opacity = "1";
  }, 50);
  selected[i].animate(
    [{ transform: "opacity(1)" }, { transform: "opacity(0)" }],
    { duration: 50, delay: 2000 }
  );
  setTimeout(() => {
    document.getElementById("notification").style.opacity = "0";
  }, 2050);
}

// move tiles to new locations and generate answer block
function correct() {
  let row = Math.floor(wordList.indexOf(selected[0].innerHTML) / 4);
  complete[row] = 1;
  let swap = [];
  for (let i = 0; i < 4; i++) {
    if (
      Math.floor(order[wordList.indexOf(selected[i].innerHTML)] / 4) != rows
    ) {
      swap.push(order[wordList.indexOf(selected[i].innerHTML)]);
    }
  }
  let top = [];
  for (let i = rows * 4; i < rows * 4 + 4; i++) {
    if (Math.floor(order.indexOf(i) / 4) != row) {
      top.push(i);
    }
  }
  for (let i in swap) {
    let pos1 = document.getElementById("b" + swap[i]).getBoundingClientRect();
    let pos2 = document.getElementById("b" + top[i]).getBoundingClientRect();
    let tx = pos1.x - pos2.x;
    let ty = pos1.y - pos2.y;
    let movement1 =
      "translateX(" + tx * -1 + "px) translateY(" + ty * -1 + "px)";
    let movement2 = "translateX(" + tx + "px) translateY(" + ty + "px)";
    let move1 = [{ transform: "translateX(0px)" }, { transform: movement1 }];
    let move2 = [{ transform: "translateX(0px)" }, { transform: movement2 }];
    document.getElementById("b" + swap[i]).animate(move1, { duration: 1010 });
    document.getElementById("b" + top[i]).animate(move2, { duration: 1010 });
  }

  setTimeout(() => {
    showAnswers(swap, top, row);
  }, 1000);
}

// displays answers
function showAnswers(swap, top, row) {
  for (let i in swap) {
    let temp = document.getElementById("b" + swap[i]).innerHTML;
    document.getElementById("b" + swap[i]).innerHTML = document.getElementById(
      "b" + top[i]
    ).innerHTML;
    document.getElementById("b" + top[i]).innerHTML = temp;
    let i1 = order.indexOf(swap[i]);
    let i2 = order.indexOf(top[i]);

    let temp1 = order[i1];
    order[i1] = order[i2];
    order[i2] = temp1;
  }

  deselect();
  rows++;

  let box = document.getElementById("r" + rows);
  let answer = document.createElement("div");
  answer.style.position = "absolute";
  answer.style.width = document.getElementById("r1").clientWidth - 8 + "px";
  answer.style.height = document.getElementById("b0").clientHeight + "px";
  answer.style.borderRadius = "6px";
  answer.style.backgroundColor = colours[row];
  answer.style.zIndex = "1";

  let head = document.createElement("p");
  let category = document.createTextNode(categories[row]);
  head.appendChild(category);
  head.style.fontFamily = "Franklin Gothic Regular";
  head.style.margin = 0;
  head.style.marginTop =
    0.5 * document.getElementById("b0").clientHeight - 24 + "px";
  answer.appendChild(head);

  text = "";
  for (let i = 0; i < 3; i++) {
    text += wordList[row * 4 + i] + ", ";
  }
  text += wordList[row * 4 + 3];
  let answers = document.createElement("p");
  let answerText = document.createTextNode(text);
  answers.appendChild(answerText);
  answers.style.fontFamily = "Franklin Gothic ITC";
  answers.style.margin = 0;
  answer.appendChild(answers);
  answer.style.textAlign = "center";
  answer.style.fontSize = "20px";
  box.appendChild(answer);

  let move = [
    { transform: "scale(1)" },
    { transform: "scale(1.1)" },
    { transform: "scale(1)" },
  ];
  answer.animate(move, { duration: 300, delay: 0 });
}

// autocomplete game when all lives lost
function autocomplete() {
  deselect();
  let skip = 0;
  for (let i = 0; i < 4; i++) {
    if (complete[i] == 0) {
      setTimeout(() => {
        finish(i);
      }, 2400 * (i - skip));
    } else {
      skip++;
    }
  }
}

// finish one row
function finish(i) {
  for (let j = i * 4; j < i * 4 + 4; j++) {
    selected.push(document.getElementById("b" + order[j]));
  }
  submit();
}

// remove life if wrong
function wrong() {
  for (let i in selected) {
    let move = [
      { transform: "translateX(0px)", backgroundColor: "#bab1a7" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(0px)", backgroundColor: "#bab1a7" },
    ];
    selected[i].animate(move, { duration: 250, delay: 1200 });
    selected[i].animate(
      [{ backgroundColor: "#bab1a7" }, { backgroundColor: "#bab1a7" }],
      { duration: 500, delay: 1450 }
    );
  }
  let moveLife = [
    { transform: "scale(1)" },
    { transform: "scale(1.5)" },
    { transform: "scale(0.75)" },
    { transform: "scale(0)" },
  ];
  document
    .getElementById("life" + lives)
    .animate(moveLife, { duration: 600, delay: 2100 });
  setTimeout(() => {
    document.getElementById("life" + lives).style.backgroundColor = "#ffffff";
    lives--;
    if (lives == 0) {
      autocomplete();
    }
  }, 2600);
}

function submitOn() {
  document.getElementById("submit").style.borderColor = "#000000";
  document.getElementById("submit").style.color = "#000000";
}

function submitOff() {
  document.getElementById("submit").style.borderColor = "#7F7F7F";
  document.getElementById("submit").style.color = "#7F7F7F";
}

function reset() {
  for (let i = 0; i < words.length; i++) {
    words[i].style.backgroundColor = "rgb(239, 239, 230)";
    words[i].style.color = "#000000";
  }
}

function getDate() {
  const date = new Date();
  let df = "";
  switch (date.getMonth()) {
    case 0:
      df += "January";
      break;
    case 1:
      df += "February";
      break;
    case 2:
      df += "March";
      break;
    case 3:
      df += "April";
      break;
    case 4:
      df += "May";
      break;
    case 5:
      df += "June";
      break;
    case 6:
      df += "July";
      break;
    case 7:
      df += "August";
      break;
    case 8:
      df += "September";
      break;
    case 9:
      df += "October";
      break;
    case 10:
      df += "November";
      break;
    case 11:
      df += "December";
      break;
  }
  df += " " + date.getDate() + ", " + date.getFullYear();
  document.getElementById("date").innerHTML = "<b>" + df + "</b>";
  document.getElementById("date2").innerHTML = df;
}

function getGames() {
  return [
    {
      categories: [
        "Playfully bother",
        "Apex",
        "Words for Specific Quantities",
        "What 'X' Might Mean",
      ],
      wordList: [
        "josh",
        "kid",
        "rib",
        "tease",
        "height",
        "max",
        "peak",
        "top",
        "dozen",
        "gross",
        "pair",
        "score",
        "adult",
        "kiss",
        "ten",
        "times",
      ],
    },
    {
      categories: [
        "Gift-giving accessories",
        "Dating app actions",
        "Cool, in slang",
        "Lucky ____",
      ],
      wordList: [
        "bow",
        "box",
        "card",
        "wrapping",
        "block",
        "match",
        "message",
        "swipe",
        "fire",
        "lit",
        "sick",
        "tight",
        "break",
        "charm",
        "duck",
        "strike",
      ],
    },
    {
      categories: [
        "Move through the air",
        "Hidden listening devices",
        "Select, as a box on a form",
        "Rappers minus first letter",
      ],
      wordList: [
        "float",
        "fly",
        "glide",
        "soar",
        "bug",
        "mike",
        "tap",
        "wire",
        "check",
        "mark",
        "tick",
        "X",
        "40",
        "cole",
        "pain",
        "tip",
      ],
    },
    {
      categories: [
        "B.L.T. ingredients",
        "Obstruct",
        "Baseball stats",
        "Small ___",
      ],
      wordList: [
        "bread",
        "bacon",
        "lettuce",
        "tomato",
        "block",
        "clog",
        "jam",
        "stop",
        "double",
        "hit",
        "run",
        "walk",
        "fry",
        "talk",
        "wonder",
        "world",
      ],
    },
    {
      categories: [
        "Gardening nouns/verbs",
        "Kinds of salads",
        "Classic game shows, familiarly",
        "W+ vowel sound",
      ],
      wordList: [
        "plant",
        "seed",
        "water",
        "weed",
        "caesar",
        "greek",
        "green",
        "wedge",
        "feud",
        "millionaire",
        "pyramid",
        "wheel",
        "way",
        "wee",
        "why",
        "whoa",
      ],
    },
    {
      categories: [
        "Organization",
        "Sharpness, as of an image",
        "Places in France",
        "Happy New Year!",
      ],
      wordList: [
        "club",
        "group",
        "party",
        "team",
        "clarity",
        "definition",
        "detail",
        "resolution",
        "champagne",
        "dijon",
        "nice",
        "tours",
        "ball",
        "countdown",
        "fireworks",
        "kiss",
      ],
    },
    {
      categories: [
        "Black and white animals",
        "Sequence",
        "Heteronyms",
        "___ trap",
      ],
      wordList: [
        "orca",
        "panda",
        "skunk",
        "zebra",
        "chain",
        "series",
        "string",
        "train",
        "bass",
        "dove",
        "desert",
        "wind",
        "bear",
        "sand",
        "speed",
        "tourist",
      ],
    },
  ];
}
