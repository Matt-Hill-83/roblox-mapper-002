const colors = {
  green001: "rgb(232, 244, 232)",
  green002: "rgba(170, 215, 170, 1)",
  green003: "rgba(140, 200, 140, 1)",
  green004: "rgba(110, 180, 110, 1)",
  green005: "rgba(80, 160, 80, 1)",
  green006: "rgba(50, 140, 50, 1)",
  green007: "rgba(35, 115, 35, 1)",
  green008: "rgba(25, 95, 25, 1)",
  green009: "rgba(15, 75, 15, 1)",
  green010: "rgba(0, 60, 0, 1)",

  red001: "rgba(255, 235, 235, 1)",
  red002: "rgba(255, 214, 214, 1)",
  red003: "rgba(255, 193, 193, 1)",
  red004: "rgba(255, 172, 172, 1)",
  red005: "rgba(255, 151, 151, 1)",
  red006: "rgba(255, 129, 129, 1)",
  red007: "rgba(255, 108, 108, 1)",
  red008: "rgba(235, 77, 77, 1)",
  red009: "rgba(214, 56, 56, 1)",
  red010: "rgba(193, 0, 0, 1)",

  orange001: "rgba(255, 243, 224, 1)",
  orange002: "rgba(255, 236, 209, 1)",
  orange003: "rgba(255, 224, 178, 1)",
  orange004: "rgba(255, 204, 128, 1)",
  orange005: "rgba(255, 183, 77, 1)",
  orange006: "rgba(255, 167, 38, 1)",
  orange007: "rgba(255, 152, 0, 1)",
  orange008: "rgba(255, 143, 0, 1)",
  orange009: "rgba(255, 111, 0, 1)",
  orange010: "rgba(230, 81, 0, 1)",

  purple001: "rgba(240, 230, 255, 1)",
  purple002: "rgba(230, 210, 250, 1)",
  purple003: "rgba(210, 180, 240, 1)",
  purple004: "rgba(190, 150, 230, 1)",
  purple005: "rgba(170, 120, 220, 1)",
  purple006: "rgba(150, 90, 200, 1)",
  purple007: "rgba(130, 60, 180, 1)",
  purple008: "rgba(110, 30, 160, 1)",
  purple009: "rgba(90, 10, 140, 1)",
  purple010: "rgba(70, 0, 120, 1)",

  blue001: "rgb(244, 249, 254)",
  blue002: "rgba(204, 229, 255, 1)",
  blue003: "rgba(178, 216, 255, 1)",
  blue004: "rgba(153, 204, 255, 1)",
  blue005: "rgba(127, 191, 255, 1)",
  blue006: "rgba(102, 178, 255, 1)",
  blue007: "rgba(76, 165, 255, 1)",
  blue008: "rgba(51, 153, 255, 1)",
  blue009: "rgba(25, 140, 255, 1)",
  blue010: "rgb(25, 108, 192)",
  blue011: "rgb(20, 90, 160)",
  blue012: "rgb(16, 75, 130)",
  blue013: "rgb(12, 60, 100)",
  blue014: "rgb(8, 45, 70)",
  blue015: "rgb(4, 30, 40)",

  gray001: "rgb(255, 255, 255)",
  gray002: "rgba(240, 240, 240, 1)",
  gray003: "rgba(224, 224, 224, 1)",
  gray004: "rgba(200, 200, 200, 1)",
  gray005: "rgba(180, 180, 180, 1)",
  gray006: "rgba(160, 160, 160, 1)",
  gray007: "rgba(125, 125, 125, 1)",
  gray008: "rgba(100, 100, 100, 1)",
  gray009: "rgba(75, 75, 75, 1)",
  gray010: "rgb(0, 0, 0)",
} as const;

const mainBgColor = colors.blue010;
const secondaryBgColor = colors.blue005;
const mainHeaderColor = colors.blue012;
const mainBorderColor = colors.blue010;
const mainTextColor = colors.gray010;

// App layout colors
export const appLayout = {
  mainBgColor,
  secondaryBgColor,
  mainHeaderColor,
  mainBorderColor,
  mainTextColor,
};

// Only use colors between 003 and 007, interleaved and randomized order
const colorSets = [
  [
    colors.blue003,
    colors.green003,
    colors.orange003,
    colors.red003,
    colors.purple003,
    colors.gray003,
  ],
  [
    colors.blue004,
    colors.green004,
    colors.orange004,
    colors.red004,
    colors.purple004,
    colors.gray004,
  ],
  [
    colors.blue005,
    colors.green005,
    colors.orange005,
    colors.red005,
    colors.purple005,
    colors.gray005,
  ],
  [
    colors.blue006,
    colors.green006,
    colors.orange006,
    colors.red006,
    colors.purple006,
    colors.gray006,
  ],
  [
    colors.blue007,
    colors.green007,
    colors.orange007,
    colors.red007,
    colors.purple007,
    colors.gray007,
  ],
];

function interleavedColorPool() {
  const pool = [];
  for (let i = 0; i < colorSets.length; i++) {
    for (let j = 0; j < colorSets[i].length; j++) {
      pool.push(colorSets[i][j]);
    }
  }
  return pool;
}

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const nodeColorPool = shuffle([...interleavedColorPool()]);
const edgeColorPool = shuffle([...interleavedColorPool()]);

const nodeColors = {
  levels: shuffle([...nodeColorPool]),
};

const edgeColors = {
  types: shuffle([...edgeColorPool]),
};

const colorTokens = {
  colors,
  appLayout,

  pages: {
    hiTester: {
      graphs: {
        nodeColors,
        edgeColors,
      },
    },
  },
};

export default colorTokens;