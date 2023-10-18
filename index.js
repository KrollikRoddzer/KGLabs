const STANDART_COLOR = {r: 0, g: 0, b: 0};
const RGB_inputs = [
    document.querySelector('#red'),
    document.querySelector('#green'),
    document.querySelector('#blue'),
];

const HLS_inputs = [
    document.querySelector('#hue'),
    document.querySelector('#lightness'),
    document.querySelector('#saturation')
];

const CMYK_inputs = [
    document.querySelector('#cyan'),
    document.querySelector('#magenta'),
    document.querySelector('#yellow'),
    document.querySelector('#key'),
];

const INPUTS = [
    document.querySelector('#red'),
    document.querySelector('#green'),
    document.querySelector('#blue'),
    document.querySelector('#hue'),
    document.querySelector('#lightness'),
    document.querySelector('#saturation'),
    document.querySelector('#cyan'),
    document.querySelector('#magenta'),
    document.querySelector('#yellow'),
    document.querySelector('#key'),
];

const RANGES = {
    red: [0, 255],
    green: [0, 255],
    blue: [0, 255],
    hue: [0, 360],
    lightness: [0, 100],
    saturation: [0, 100],
    cyan: [0, 100],
    magenta: [0, 100],
    yellow: [0, 100],
    key: [0, 100],
}

for (let input of INPUTS) {
  input.addEventListener('input', (e) => {
    let range = RANGES[e.currentTarget.id];
    let num = Number(e.currentTarget.value);
    
    if (num < range[0]) {
      e.currentTarget.value = range[0];
    }
    else if (num > range[1]) {
      e.currentTarget.value = range[1];
    }

    console.log(Number(e.currentTarget.value));
    
    let hls = { h: Number(INPUTS[3].value), l : Number(INPUTS[4].value), s: Number(INPUTS[5].value) };
    let rgb = { r: Number(INPUTS[0].value), g: Number(INPUTS[1].value), b: Number(INPUTS[2].value) }; 
    let cmyk = { c: Number(INPUTS[6].value), m: Number(INPUTS[7].value), y: Number(INPUTS[8].value) , k: Number(INPUTS[9].value) };
    if (e.currentTarget.dataset.type === 'RGB') {
      cmyk = RGBtoCMYK(rgb.r, rgb.g, rgb.b);
      hls = RGBtoHLS(rgb.r, rgb.g, rgb.b);
    }
    else if (e.currentTarget.dataset.type == 'CMYK') {
      rgb = CMYKtoRGB(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
      hls = RGBtoHLS(rgb.r, rgb.g, rgb.b);
    }
    else {
      rgb = HLStoRGB(hls.h, hls.l, hls.s);
      cmyk = RGBtoCMYK(rgb.r, rgb.g, rgb.b);
    }

    console.log(hls, rgb, cmyk);

    INPUTS[0].value = rgb.r;
    INPUTS[1].value = rgb.g;
    INPUTS[2].value = rgb.b;
    INPUTS[3].value = hls.h;
    INPUTS[4].value = hls.l;
    INPUTS[5].value = hls.s;
    INPUTS[6].value = cmyk.c;
    INPUTS[7].value = cmyk.m;
    INPUTS[8].value = cmyk.y;
    INPUTS[9].value = cmyk.k;
  });
}

function RGBtoCMYK(R, G, B) {
    let k = 1 - Math.max(R, G, B) / 255;
    let c = (1 - R / 255 - k) / (1 - k);
    let m = (1 - G / 255 - k) / (1 - k);
    let y = (1 - B / 255 - k) / (1 - k);
    if (k == 1) {
        return {
            c: 0,
            m: 0,
            y: 0,
            k: k * 100,
        };
    }
    return {
        c: c * 100,
        m: m * 100,
        y: y * 100,
        k: k * 100,
    };
}

function CMYKtoRGB(C, M, Y, K) {
  C = C / 100;
  M = M / 100;
  Y = Y / 100;
  K = K / 100;
    return {
        r: 255 * (1 - C) * (1 - K),
        g: 255 * (1 - M) * (1 - K),
        b: 255 * (1 - Y) * (1 - K),
    };
}

function RGBtoHLS(r, g, b) {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let delta = max - min;

  let h, l, s;

  if (delta == 0) {
    h = 0;
  }
  else {
    if (max == r) {
      h = 60 * ((((g - b) / delta) % 6));
    }
    if (max == g) {
      h = 60 * ((b - r) / delta + 2);
    }
    if (max == b) {
      h = 60 * ((r - g) / delta + 3);
    }
  }

  l = (max + min) / 2;
  s = delta / (1 - Math.abs(2 * l - 1));
  if (l == 0) {
    s = 0;
  }
  return { h: h, l: l * 100, s: s * 100};
}


function HLStoRGB(h, l, s) {
  l /= 100;
  s /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs(h / 60) % 2 - 1);
  let m = l - c / 2;

  let r, g, b;
  if ((h >= 0 && h < 60) || h == 360) {
    r = c;
    g = x;
    b = 0;
  }
  if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  }
  if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  }
  if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  }
  if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  }
  if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

function init() {
    let hls = RGBtoHLS(STANDART_COLOR.r, STANDART_COLOR.g, STANDART_COLOR.b);
    let cmyk = RGBtoCMYK(STANDART_COLOR.r, STANDART_COLOR.g, STANDART_COLOR.b);
    let rgb = { r: STANDART_COLOR.r, g: STANDART_COLOR.g, b: STANDART_COLOR.b };
    
    INPUTS[0].value = rgb.r;
    INPUTS[1].value = rgb.g;
    INPUTS[2].value = rgb.b;
    INPUTS[3].value = hls.h;
    INPUTS[4].value = hls.l;
    INPUTS[5].value = hls.s;
    INPUTS[6].value = cmyk.c;
    INPUTS[7].value = cmyk.m;
    INPUTS[8].value = cmyk.y;
    INPUTS[9].value = cmyk.k;
}

init();

for (let item of INPUTS) {
    item.addEventListener('input', (e) => {
        console.log(e.currentTarget.dataset.type);
    });
}

console.log(HLStoRGB(0, 9, 0));