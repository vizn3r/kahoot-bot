import Kahoot from "kahoot.js-updated-fixed";
import readline from "node:readline";
import fs from "node:fs";
import fetch from "node-fetch";
import util from "util";
import answers from "./answers.js";

process.setMaxListeners(process.getMaxListeners() + 1).on("unhandledRejection", (r, p) => console.log(r, p));

const art = `
▄▄▄       ███▄    █ ▓█████  ██▓        ██ ▄█▀▄▄▄       ██░ ██  ▒█████   ▒█████  ▄▄▄█████▓    ▄▄▄▄    ▒█████  ▄▄▄█████▓
▒████▄     ██ ▀█   █ ▓█   ▀ ▓██▒        ██▄█▒▒████▄    ▓██░ ██▒▒██▒  ██▒▒██▒  ██▒▓  ██▒ ▓▒   ▓█████▄ ▒██▒  ██▒▓  ██▒ ▓▒
▒██  ▀█▄  ▓██  ▀█ ██▒▒███   ▒██░       ▓███▄░▒██  ▀█▄  ▒██▀▀██░▒██░  ██▒▒██░  ██▒▒ ▓██░ ▒░   ▒██▒ ▄██▒██░  ██▒▒ ▓██░ ▒░
░██▄▄▄▄██ ▓██▒  ▐▌██▒▒▓█  ▄ ▒██░       ▓██ █▄░██▄▄▄▄██ ░▓█ ░██ ▒██   ██░▒██   ██░░ ▓██▓ ░    ▒██░█▀  ▒██   ██░░ ▓██▓ ░ 
▓█   ▓██▒▒██░   ▓██░░▒████▒░██████▒   ▒██▒ █▄▓█   ▓██▒░▓█▒░██▓░ ████▓▒░░ ████▓▒░  ▒██▒ ░    ░▓█  ▀█▓░ ████▓▒░  ▒██▒ ░ 
▒▒   ▓▒█░░ ▒░   ▒ ▒ ░░ ▒░ ░░ ▒░▓  ░   ▒ ▒▒ ▓▒▒▒   ▓▒█░ ▒ ░░▒░▒░ ▒░▒░▒░ ░ ▒░▒░▒░   ▒ ░░      ░▒▓███▀▒░ ▒░▒░▒░   ▒ ░░   
 ▒   ▒▒ ░░ ░░   ░ ▒░ ░ ░  ░░ ░ ▒  ░   ░ ░▒ ▒░ ▒   ▒▒ ░ ▒ ░▒░ ░  ░ ▒ ▒░   ░ ▒ ▒░     ░       ▒░▒   ░   ░ ▒ ▒░     ░    
 ░   ▒      ░   ░ ░    ░     ░ ░      ░ ░░ ░  ░   ▒    ░  ░░ ░░ ░ ░ ▒  ░ ░ ░ ▒    ░          ░    ░ ░ ░ ░ ▒    ░      
     ░  ░         ░    ░  ░    ░  ░   ░  ░        ░  ░ ░  ░  ░    ░ ░      ░ ░               ░          ░ ░           
                                                                                                  ░                   
`;

const welcArt = `
████████████████████████████████████████████████
█▄─█▀▀▀█─▄█▄─▄▄─█▄─▄███─▄▄▄─█─▄▄─█▄─▀█▀─▄█▄─▄▄─█
██─█─█─█─███─▄█▀██─██▀█─███▀█─██─██─█▄█─███─▄█▀█
▀▀▄▄▄▀▄▄▄▀▀▄▄▄▄▄▀▄▄▄▄▄▀▄▄▄▄▄▀▄▄▄▄▀▄▄▄▀▄▄▄▀▄▄▄▄▄▀`;

console.clear();
console.log(welcArt);
console.log(art);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const delay = (d = 1000) => new Promise((res) => setTimeout(res, d));

const q = util.promisify(rl.question).bind(rl);

let r = true;
const start = async () => {
    while (r)
        switch (await q("\n\n>> Choose one option [ 0 - Documentation | 1 - Start | 2 - Exit]: ")) {
            case "0":
                console.clear();
                console.log(fs.readFileSync("./readme.md", { encoding: "utf8" }));
                break;
            case "1":
                console.clear();
                r = false;
                break;
            case "2":
                process.exit(0);
        }
};

await start();

console.log(">> Enter following parameters [ parameters marked with * are required ]:");
const pin = await q("    >> * Game Pin: ");
let count = (await q("    >> Bot Count: ")) || 1;
const id = await q("    >> * Quiz ID: ");
let name = await q("    >> Bot Name/s [ see in documentation ]: ");
const d = (await q("    >> Delay: ")) || 1000;
const acc = (await q("    >> Accuracy: ")) || 1;

let c = [],
    cc = [],
    n = "";
const e = "\x1b[0m";

const barcode = (count = 10) => {
    count < 10 ? (count = 10) : null;
    let out = "";
    for (let i = 0; i < count; i++) Math.random() < 0.5 ? (out += "l") : (out += "|");
    return out;
};

const fdata = await fetch("https://create.kahoot.it/rest/kahoots/" + id);
const data = await fdata.json();
if (data.questions) console.log(">> Fetched data");

// console.log(data);

try {
    for (let i = 0; i < count; i++) {
        await delay();
        if (Array.isArray(name)) n = name[i];
        else if (name.startsWith("barcode")) n = barcode(name.slice(name.length));
        // else if (name == "emoji") n = require("./emoji.js")();
        else if (name == null) n = (Math.random() * 100).toString(16);
        else if (name.startsWith("[") && name.endsWith("]")) {
            name = name
                .split("")
                .slice(1, name.length - 1)
                .join("")
                .split(",");
            if (name.length !== count) {
                console.log(`>> There was provided ${name.length} names, setting count to ${name.length}`);
                count = name.length;
            }
            n = name[i];
        } else n = name;
        cc[i] = `\x1b[48;2;${(Math.random() * 255).toFixed()};${(Math.random() * 255).toFixed()};${(Math.random() * 255).toFixed()}m\x1b[38;2;${(
            Math.random() * 255
        ).toFixed()};${(Math.random() * 255).toFixed()};${(Math.random() * 255).toFixed()}m`;
        c[i] = new Kahoot();
        c[i].setMaxListeners(Infinity);
        c[i].join(pin, n);
        c[i].once("QuizStart", () => console.log(`${cc[i]} [${i}] Paricipaing in quiz ${e}`));
        c[i].once("Join", () => console.log(`[${i}] New client <${n}>`));
        c[i].on("QuestionStart", async (q) => {
            const answer = await answers(q.index, data, acc);
            await delay(d);
            console.log(`${cc[i]}[${i}] Answering question <${answer}> <${q.type}>${e}`);
            await q.answer(answer);
        });
    }
} catch (err) {
    console.log(err);
}
await start();
