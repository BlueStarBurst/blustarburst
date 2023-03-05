import * as hangul from 'hangul-js';

export default function getHangul(str) {
    var hangul = require('hangul-js');
    var hangulStr = hangul.disassemble(str);
    var flip = false;
    var flip2 = false;
    var hangulStr = hangulStr.map((x, i) => {
        if (flip2) {
            flip2 = false;
            return "";
        }
        if (flip) {
            flip = false;
            return "";
        }
        if (x === "y" && hangulStr[i + 1] === "e" && hangulStr[i + 2] === "o") {
            flip = true;
            flip2 = true;
            return phonetics["yeo"];
        } else if (x === "y" && hangulStr[i + 1] === "a" && hangulStr[i + 2] === "e") {
            flip = true;
            flip2 = true;
            return phonetics["yae"];
        } else if (x === "w" && hangulStr[i + 1] === "a" && hangulStr[i + 2] === "e") {
            flip = true;
            flip2 = true;
            return phonetics["wae"];
        } else if (x === "e" && hangulStr[i + 1] === "o") {
            flip = true;
            return phonetics["eo"];
        } else if (x === "e" && hangulStr[i + 1] === "u") {
            flip = true;
            return phonetics["eu"];
        } else if (x === "k" && hangulStr[i + 1] === "k") {
            flip = true;
            return phonetics["kk"];
        } else if (x === "p" && hangulStr[i + 1] === "p") {
            flip = true;
            return phonetics["pp"];
        } else if (x === "s" && hangulStr[i + 1] === "s") {
            flip = true;
            return phonetics["ss"];
        } else if (x === "j" && hangulStr[i + 1] === "j") {
            flip = true;
            return phonetics["jj"];
        } else if (x === "t" && hangulStr[i + 1] === "t") {
            flip = true;
            return phonetics["tt"];
        } else if (x === "c" && hangulStr[i + 1] === "h") {
            flip = true;
            return phonetics["ch"];
        } else if (x === "w" && hangulStr[i + 1] === "a") {
            flip = true;
            return phonetics["wa"];
        } else if (x === "w" && hangulStr[i + 1] === "e") {
            flip = true;
            return phonetics["we"];
        } else if (x === "w" && hangulStr[i + 1] === "o") {
            flip = true;
            return phonetics["wo"];
        } else if (x === "y" && hangulStr[i + 1] === "a") {
            flip = true;
            return phonetics["ya"];
        } else if (x === "y" && hangulStr[i + 1] === "e") {
            flip = true;
            return phonetics["ye"];
        } else if (x === "y" && hangulStr[i + 1] === "o") {
            flip = true;
            return phonetics["yo"];
        } else if (x === "y" && hangulStr[i + 1] === "u") {
            flip = true;
            return phonetics["yu"];
        } else if (x === "n" && hangulStr[i + 1] === "g") {
            flip = true;
            return phonetics["ng"];
        }

        if (phonetics[x] === undefined) {
            return x;
        }

        return phonetics[x];
    })

    return hangul.assemble(hangulStr);
}

const phonetics = {
    "g": "ㄱ",
    "kk": "ㄲ",
    "n": "ㄴ",
    "t": "ㄷ",
    "tt": "ㄸ",
    "r": "ㄹ",
    "m": "ㅁ",
    "p": "ㅂ",
    "pp": "ㅃ",
    "s": "ㅅ",
    "ss": "ㅆ",
    "ng": "ㅇ",
    "j": "ㅈ",
    "jj": "ㅉ",
    "ch": "ㅊ",
    "k": "ㅋ",
    "t": "ㅌ",
    "p": "ㅍ",
    "h": "ㅎ",
    "a": "ㅏ",
    "ae": "ㅐ",
    "ya": "ㅑ",
    "yae": "ㅒ",
    "eo": "ㅓ",
    "e": "ㅔ",
    "yeo": "ㅕ",
    "ye": "ㅖ",
    "o": "ㅗ",
    "wa": "ㅘ",
    "wae": "ㅙ",
    "oe": "ㅚ",
    "yo": "ㅛ",
    "u": "ㅜ",
    "wo": "ㅝ",
    "we": "ㅞ",
    "wi": "ㅟ",
    "yu": "ㅠ",
    "eu": "ㅡ",
    "ui": "ㅢ",
    "i": "ㅣ",
    "": " ",
    " ": " "
}