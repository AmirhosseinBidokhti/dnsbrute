const { exec, spawn, execSync } = require("child_process");

var shell = require("shelljs");

const { writeFile } = require("fs");

// utils
// https://stackoverflow.com/questions/34857458/reading-local-text-file-into-a-javascript-array

// let subs = []

var domain = "sidefx.com";

var fs = require("fs");

var fs = require("fs");
var text = fs.readFileSync("./wordlist", "utf-8");

// \r\n vs \n (?)

// \r\n works on windows
// \n works on linux
// handle this based on user os

// var textByLine = text.split("\r\n")
// textByLine.map(sub => {
//   console.log(`${sub}.${domain}`);
// })

let command = `curl -s https://www.abuseipdb.com/whois/${domain} -H "user-agent: Chrome" | grep -E "<li>\\w.*</li>"| sed -E "s/<\\/?li>//g" | sed -e "s/$/.${domain}/" | sort -u > boob/mmm.txt`;

const output = execSync(command, { encoding: "utf-8" }); // the default is 'buffer'
// console.log('Output was:\n', output);

let crt = `curl -sk "https://crt.sh/?q=${domain}&output=json" | jq -r ".[].common_name,.[].name_value" | sed "s/*.//g" | sort -u > crt`;

///let subfinder  = `subfinder -d ${domain} -nC -silent > subfinder-result`

// exec(command)
// exec(crt)
//xec(subfinder)
