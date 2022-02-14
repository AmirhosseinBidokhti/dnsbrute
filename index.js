//const { exec, spawn, execSync } = require("child_process");
import { exec, execFile, execFileSync, execSync } from "child_process";
import fs from "fs";

//const { writeFile } = require("fs");
// writeFile('crtsh_result', "", function (err) {
//   if (err) throw err;
//   console.log('File is created successfully.')
// });

let subdomainProviders = [];

function execWrapper(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`error: ${error.message}`);
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
      }
      resolve(true);
    });
  });
}
function execSyncWrapper(command) {
  return new Promise((resolve, reject) => {
    execSync(command, (error, stdout, stderr) => {
      if (error) {
        reject(`error: ${error.message}`);
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
      }
      resolve(true);
    });
  });
}

async function abuseipdb(domain) {
  try {
    console.log("abuseipdb being feteched...");
    let command = `curl -s https://www.abuseipdb.com/whois/${domain} -H "user-agent: Chrome" | grep -E "<li>\\w.*</li>"| sed -E "s/<\\/?li>//g" | sed -e "s/$/.${domain}/" | sort -u > abuseipdb.txt`;

    const res = await execWrapper(command);

    if (res) {
      console.log("successfully fetched abuseipdb");
      subdomainProviders.push("abuseipdb.txt");
    }
  } catch (error) {
    console.log("Error while fetching abuseipdb: " + error);
  }
}
async function crtsh(domain) {
  try {
    console.log("crtsh being feteched...");
    let command = `curl -sk "https://crt.sh/?q=${domain}&output=json" | jq -r ".[].common_name,.[].name_value" | sed "s/*.//g" | sort -u > crtsh.txt`;

    const res = await execWrapper(command);

    if (res) {
      console.log("successfully fetched crtsh");
      subdomainProviders.push("crtsh.txt");
    }
  } catch (error) {
    console.log("Error while fetching crtsh: " + error);
  }
}

async function subfinder(domain) {
  try {
    console.log("subfinder being feteched...");
    let command = `subfinder -d ${domain} -nC -silent > subfinder.txt`;

    const res = await execWrapper(command);

    if (res) {
      console.log("successfully fetched subfinder");
      subdomainProviders.push("subfinder.txt");
    }
  } catch (error) {
    console.log("Error while fetching subfinder: " + error);
  }
}

//let command = `cat ${file} | sort -u > ${outputFile}`
function uniquefyFiles(files, outputFile) {
  files.map(async (file) => {
    let command = `cat ${file} >> tempUnique`;
    execSync(command);
  });

  let command = `cat tempUnique | sort -u > ${outputFile}`;
  execSync(command);
  fs.unlinkSync("tempUnique");
  //execSync("rm -rf tempUnique");
}

import { dirname } from "path";
import { fileURLToPath } from "url";
import writeArrayToFile from "./writearraytofile.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function subdomainGenerator(domain, wordlist) {
  return new Promise((resolve, reject) => {
    const wordlistPath = `${__dirname}/${wordlist}`;
    var text = fs.readFileSync(wordlistPath, "utf-8");
    var subdomains = [];
    var textByLine = text.split("\r\n");
    textByLine.map((sub) => {
      subdomains.push(`${sub}.${domain}`);
    });

    writeArrayToFile(subdomains, "subdomainGeneratorRes");
    subdomainProviders.push("subdomainGeneratorRes.txt");
    resolve(true);
  });
}
//shuffledns -d example.com -list example-subdomains.txt -r resolvers.txt
async function shuffleDNS(domain, resolvers) {
  try {
    console.log("[+] Starting shuffledns...");
    let command = `shuffledns -d ${domain} -list unique.txt -r ${resolvers} -silent > resolve_1.txt`;

    const res = await execWrapper(command);

    if (res) {
      console.log("successfully done with shuffledns");
      subdomainProviders.push("subfinder.txt");
    }
  } catch (error) {
    console.log("Error while running shuffledns: " + error);
  }
}

async function dnsgen(mergeSubdomains) {
  try {
    console.log("[+] Starting dnsgen...");
    const command = `cat ${mergeSubdomains} | dnsgen - | sort -u > dnsgen_final`;
    const res = await execWrapper(command);
  } catch (error) {
    console.log("error " + error);
  }
}

await dnsgen("resolve_1.txt");

async function main() {
  try {
    await subdomainGenerator("sidefx.com", "wordlist");
    await abuseipdb("sidefx.com");
    await crtsh("sidefx.com");
    await subfinder("sidefx.com");

    // Merging process
    uniquefyFiles(subdomainProviders, "unique.txt");

    await shuffleDNS("sidefx.com", "./resolvers.txt");

    // subdomainProviders.map((subdomainProvider) => {
    //   if (fs.existsSync(subdomainProvider)) {
    //     // path exists so delete it
    //     fs.unlinkSync(subdomainProvider);
    //   }
    // });
  } catch (error) {
    console.log(error);
  }
}

//main();
