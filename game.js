const GRID_W = 18;
const GRID_H = 14;
const CELL = 32;
const MOVE_MS = 680;

const TEXT = {
  ready: "\u6309\u65b9\u5411\u952e\u5f00\u59cb",
  running: "\u6162\u901f\u79fb\u52a8\u4e2d",
  wall: "\u649e\u5230\u8fb9\u754c",
  body: "\u78b0\u5230\u8eab\u4f53",
  offPath: "\u5df2\u504f\u79bb\u6700\u77ed\u8def\u5f84",
  stepMiss: "\u6b65\u6570\u672a\u8fbe\u6807",
  win: "\u901a\u5173"
};

const COLORS = {
  board: "#151a1b",
  boardAlt: "#182021",
  grid: "#263031",
  coin: "#ffc83d",
  coinDark: "#b66b17",
  coinLight: "#fff2a4",
  snake: "#46d16a",
  snakeDark: "#167a3c",
  snakeHead: "#61e7c5",
  eye: "#112017",
  fail: "rgba(255, 90, 95, 0.18)",
  win: "rgba(97, 231, 197, 0.14)"
};

const LEVELS = [
  {
    fruit: "\u82f9\u679c",
    name: "\u5173\u5361\u4e00",
    icon: "\u82f9",
    path: [
      [8, 4], [9, 4], [9, 5], [10, 5], [11, 5], [11, 6], [12, 6],
      [12, 7], [11, 7], [11, 8], [10, 8], [10, 9], [9, 9], [8, 9],
      [7, 9], [7, 8], [6, 8], [6, 7], [5, 7], [5, 6], [6, 6],
      [6, 5], [7, 5], [8, 5], [8, 6], [7, 6], [7, 7], [8, 7],
      [8, 8], [9, 8], [9, 7], [10, 7], [10, 6], [9, 6]
    ]
  },
  {
    fruit: "\u9999\u8549",
    name: "\u5173\u5361\u4e8c",
    icon: "\u8549",
    path: [
      [5, 5], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [9, 5],
      [10, 5], [11, 5], [11, 6], [12, 6], [12, 7], [13, 7], [13, 8],
      [12, 8], [11, 8], [11, 7], [10, 7], [10, 8], [9, 8], [9, 7],
      [8, 7], [7, 7], [7, 6], [6, 6], [6, 5], [7, 5], [8, 5],
      [8, 6], [9, 6], [10, 6]
    ]
  },
  {
    fruit: "\u8349\u8393",
    name: "\u5173\u5361\u4e09",
    icon: "\u8393",
    path: [
      [8, 3], [9, 3], [9, 4], [10, 4], [11, 4], [11, 5], [12, 5],
      [12, 6], [11, 6], [11, 7], [10, 7], [10, 8], [9, 8], [9, 9],
      [8, 9], [8, 8], [7, 8], [7, 7], [6, 7], [6, 6], [5, 6],
      [5, 5], [6, 5], [6, 4], [7, 4], [8, 4], [8, 5], [7, 5],
      [7, 6], [8, 6], [8, 7], [9, 7], [9, 6], [10, 6], [10, 5],
      [9, 5]
    ]
  },
  {
    fruit: "\u6a31\u6843",
    name: "\u5173\u5361\u56db",
    icon: "\u6a31",
    path: [
      [9, 3], [8, 3], [8, 4], [9, 4], [10, 4], [10, 5], [11, 5],
      [12, 5], [12, 6], [13, 6], [13, 7], [12, 7], [12, 8],
      [11, 8], [10, 8], [9, 8], [8, 8], [7, 8], [6, 8], [5, 8],
      [5, 7], [4, 7], [4, 6], [5, 6], [5, 5], [6, 5], [7, 5],
      [8, 5], [9, 5], [9, 6], [10, 6], [11, 6], [11, 7],
      [10, 7], [9, 7], [8, 7], [8, 6], [7, 6], [6, 6], [6, 7],
      [7, 7]
    ]
  },
  {
    fruit: "\u8461\u8404",
    name: "\u5173\u5361\u4e94",
    icon: "\u8461",
    path: [
      [8, 3], [9, 3], [9, 4], [10, 4], [10, 5], [11, 5], [11, 6],
      [12, 6], [12, 7], [11, 7], [11, 8], [10, 8], [10, 9],
      [9, 9], [8, 9], [7, 9], [7, 8], [6, 8], [6, 7], [5, 7],
      [5, 6], [6, 6], [6, 5], [7, 5], [7, 4], [8, 4], [8, 5],
      [9, 5], [9, 6], [10, 6], [10, 7], [9, 7], [9, 8], [8, 8],
      [8, 7], [7, 7], [7, 6], [8, 6]
    ]
  }
];

const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const OPPOSITE = {
  up: "down",
  down: "up",
  left: "right",
  right: "left"
};

const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const levelChip = document.querySelector("#levelChip");
const moveCount = document.querySelector("#moveCount");
const bestCount = document.querySelector("#bestCount");
const coinCount = document.querySelector("#coinCount");
const levelFruit = document.querySelector("#levelFruit");
const levelName = document.querySelector("#levelName");
const statusLine = document.querySelector("#statusLine");
const levelList = document.querySelector("#levelList");
const resetLevel = document.querySelector("#resetLevel");
const prevLevel = document.querySelector("#prevLevel");
const nextLevel = document.querySelector("#nextLevel");

let levelIndex = 0;
let snake = [];
let coins = new Set();
let originalCoins = new Set();
let moves = 0;
let gameState = "ready";
let currentDir = null;
let queuedDir = null;
let lastDir = "right";
let moveTimer = null;

function key(point) {
  return `${point.x},${point.y}`;
}

function toPoint(pair) {
  return { x: pair[0], y: pair[1] };
}

function resetCurrentLevel() {
  stopLoop();
  const level = LEVELS[levelIndex];
  const start = toPoint(level.path[0]);
  snake = [start];
  coins = new Set(level.path.slice(1).map(([x, y]) => `${x},${y}`));
  originalCoins = new Set(level.path.map(([x, y]) => `${x},${y}`));
  moves = 0;
  gameState = "ready";
  currentDir = null;
  queuedDir = null;
  lastDir = inferFirstDirection(level);
  setStatus(TEXT.ready, "");
  syncHud();
  draw();
}

function inferFirstDirection(level) {
  const [a, b] = level.path;
  if (!b) {
    return "right";
  }
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  if (dx > 0) return "right";
  if (dx < 0) return "left";
  if (dy > 0) return "down";
  return "up";
}

function setStatus(text, kind) {
  statusLine.textContent = text;
  statusLine.className = "status-line";
  if (kind) {
    statusLine.classList.add(kind);
  }
}

function syncHud() {
  const level = LEVELS[levelIndex];
  levelChip.textContent = `${levelIndex + 1} / ${LEVELS.length}`;
  moveCount.textContent = moves;
  bestCount.textContent = level.path.length - 1;
  coinCount.textContent = coins.size;
  levelFruit.textContent = level.fruit;
  levelName.textContent = level.name;

  [...levelList.querySelectorAll(".level-select")].forEach((button, index) => {
    button.classList.toggle("active", index === levelIndex);
  });
}

function insideGrid(point) {
  return point.x >= 0 && point.x < GRID_W && point.y >= 0 && point.y < GRID_H;
}

function requestDirection(dirName) {
  if (!DIRS[dirName] || gameState === "won" || gameState === "failed") {
    return;
  }

  if (currentDir && snake.length > 1 && OPPOSITE[currentDir] === dirName) {
    return;
  }

  queuedDir = dirName;
  if (gameState === "ready") {
    gameState = "running";
    setStatus(TEXT.running, "");
    startLoop();
  }
}

function startLoop() {
  if (moveTimer) {
    return;
  }
  moveTimer = window.setInterval(tick, MOVE_MS);
}

function stopLoop() {
  if (moveTimer) {
    window.clearInterval(moveTimer);
    moveTimer = null;
  }
}

function tick() {
  if (gameState !== "running") {
    return;
  }

  const desiredDir = queuedDir || currentDir;
  if (!desiredDir) {
    return;
  }

  if (!currentDir || snake.length <= 1 || OPPOSITE[currentDir] !== desiredDir) {
    currentDir = desiredDir;
  }

  queuedDir = currentDir;
  moveOneCell(currentDir);
}

function moveOneCell(dirName) {
  const dir = DIRS[dirName];
  const head = snake[snake.length - 1];
  const next = { x: head.x + dir.x, y: head.y + dir.y };
  const nextKey = key(next);
  const level = LEVELS[levelIndex];
  const optimal = level.path.length - 1;

  if (!insideGrid(next)) {
    fail(TEXT.wall);
    return;
  }

  const willEat = coins.has(nextKey);
  const tailKey = key(snake[0]);
  const snakeKeys = new Set(snake.map(key));

  if (snakeKeys.has(nextKey) && (willEat || nextKey !== tailKey)) {
    fail(TEXT.body);
    return;
  }

  if (willEat) {
    snake.push(next);
    coins.delete(nextKey);
  } else {
    snake.push(next);
    snake.shift();
  }

  moves += 1;
  lastDir = dirName;

  if (moves + coins.size > optimal) {
    fail(TEXT.offPath);
    return;
  }

  if (coins.size === 0) {
    if (moves === optimal) {
      win();
    } else {
      fail(TEXT.stepMiss);
    }
    return;
  }

  setStatus(`${TEXT.running} - ${coins.size}`, "");
  syncHud();
  draw();
}

function fail(reason) {
  stopLoop();
  gameState = "failed";
  setStatus(reason, "fail");
  syncHud();
  draw();
}

function win() {
  stopLoop();
  gameState = "won";
  setStatus(TEXT.win, "win");
  syncHud();
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawOriginalShape();
  drawCoins();
  drawSnake();
  drawOverlay();
}

function drawBoard() {
  for (let y = 0; y < GRID_H; y += 1) {
    for (let x = 0; x < GRID_W; x += 1) {
      ctx.fillStyle = (x + y) % 2 === 0 ? COLORS.board : COLORS.boardAlt;
      ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      ctx.strokeStyle = COLORS.grid;
      ctx.lineWidth = 1;
      ctx.strokeRect(x * CELL + 0.5, y * CELL + 0.5, CELL, CELL);
    }
  }
}

function drawOriginalShape() {
  originalCoins.forEach((cellKey) => {
    const [x, y] = cellKey.split(",").map(Number);
    const px = x * CELL;
    const py = y * CELL;
    ctx.fillStyle = "rgba(255, 200, 61, 0.1)";
    ctx.fillRect(px + 2, py + 2, CELL - 4, CELL - 4);
  });
}

function drawCoins() {
  coins.forEach((cellKey) => {
    const [x, y] = cellKey.split(",").map(Number);
    const px = x * CELL;
    const py = y * CELL;

    ctx.fillStyle = COLORS.coinDark;
    ctx.fillRect(px + 3, py + 5, CELL - 6, CELL - 7);
    ctx.fillStyle = COLORS.coin;
    ctx.fillRect(px + 3, py + 3, CELL - 6, CELL - 8);
    ctx.fillStyle = COLORS.coinLight;
    ctx.fillRect(px + 7, py + 7, 9, 6);
    ctx.fillStyle = "rgba(0, 0, 0, 0.14)";
    ctx.fillRect(px + CELL - 9, py + CELL - 12, 5, 5);
  });
}

function drawSnake() {
  snake.forEach((part, index) => {
    const px = part.x * CELL;
    const py = part.y * CELL;
    const isHead = index === snake.length - 1;
    const isTail = index === 0;

    ctx.fillStyle = isHead ? COLORS.snakeHead : COLORS.snake;
    ctx.fillRect(px + 3, py + 3, CELL - 6, CELL - 6);
    ctx.fillStyle = isTail ? "#2aa955" : COLORS.snakeDark;
    ctx.fillRect(px + 5, py + CELL - 9, CELL - 10, 4);

    if (isHead) {
      drawHeadDetails(px, py);
    }
  });
}

function drawHeadDetails(px, py) {
  const eyeA = { x: px + 10, y: py + 10 };
  const eyeB = { x: px + 20, y: py + 10 };

  if (lastDir === "left") {
    eyeA.x = px + 8;
    eyeB.x = px + 8;
    eyeA.y = py + 10;
    eyeB.y = py + 19;
  } else if (lastDir === "right") {
    eyeA.x = px + 22;
    eyeB.x = px + 22;
    eyeA.y = py + 10;
    eyeB.y = py + 19;
  } else if (lastDir === "down") {
    eyeA.x = px + 10;
    eyeB.x = px + 20;
    eyeA.y = py + 22;
    eyeB.y = py + 22;
  }

  ctx.fillStyle = COLORS.eye;
  ctx.fillRect(eyeA.x, eyeA.y, 4, 4);
  ctx.fillRect(eyeB.x, eyeB.y, 4, 4);
}

function drawOverlay() {
  if (gameState !== "won" && gameState !== "failed") {
    return;
  }

  ctx.fillStyle = gameState === "won" ? COLORS.win : COLORS.fail;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function buildLevelButtons() {
  levelList.innerHTML = "";
  LEVELS.forEach((level, index) => {
    const button = document.createElement("button");
    button.className = "level-select";
    button.type = "button";
    button.innerHTML = `
      <b class="fruit-pixel">${level.icon}</b>
      <span>${level.fruit}</span>
      <small>${level.path.length - 1}</small>
    `;
    button.addEventListener("click", () => {
      levelIndex = index;
      resetCurrentLevel();
    });
    levelList.appendChild(button);
  });
}

function changeLevel(delta) {
  levelIndex = (levelIndex + delta + LEVELS.length) % LEVELS.length;
  resetCurrentLevel();
}

document.addEventListener("keydown", (event) => {
  const keyMap = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    W: "up",
    s: "down",
    S: "down",
    a: "left",
    A: "left",
    d: "right",
    D: "right"
  };

  const dir = keyMap[event.key];
  if (dir) {
    event.preventDefault();
    requestDirection(dir);
  }
});

document.querySelectorAll("[data-dir]").forEach((button) => {
  button.addEventListener("click", () => requestDirection(button.dataset.dir));
});

resetLevel.addEventListener("click", resetCurrentLevel);
prevLevel.addEventListener("click", () => changeLevel(-1));
nextLevel.addEventListener("click", () => changeLevel(1));

buildLevelButtons();
resetCurrentLevel();
