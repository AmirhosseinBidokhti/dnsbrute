import fs from "fs";
import { dnsgen } from "./dnsgen/dnsgen.js";
import { shuffleDNS } from "./resolver/shuffledns.js";
import { uniquefyFiles } from "./utilities/fileUtils.js";
import { subdomainGenerator } from "./utilities/subdomainGenerator.js";

import { abuseipdb } from "./providers/abuseipdb.js";
import { crtsh } from "./providers/crtsh.js";
import { subfinder } from "./providers/subfinder.js";

import { Command } from "commander";
import chalk from "chalk";
const program = new Command();

program
  .option(
    "-d, --domain <string>",
    "The domain you want to perform dnsbrute on",
    ""
  )
  .option(
    "-w, --wordlist <string>",
    "Wordlist specified for subdomain generating",
    ""
  );

program.parse();

const domain = program.opts().domain;
const wordlist = program.opts().wordlist;

const subdomainProviders = [];
const toBeDeletedFiles = [];

async function main() {
  try {
    const wordlistSubFileName = await subdomainGenerator(domain, wordlist);
    const abuseipdbFileName = await abuseipdb(domain);
    const crtshFileName = await crtsh(domain);
    const subfinderFileName = await subfinder(domain);

    subdomainProviders.push(
      abuseipdbFileName,
      crtshFileName,
      subfinderFileName
    );

    subdomainProviders.map((pr) => console.log(pr));

    // merging all providers
    uniquefyFiles(subdomainProviders, "providers.merged.txt");

    // merging all providers + wordlist generated subdomains
    uniquefyFiles(
      [...subdomainProviders, wordlistSubFileName],
      "providers.wordlist.merged.txt"
    );

    // shuffleDNS  (providers + resovled providers + wordlist subdomains)
    await shuffleDNS(
      domain,
      "providers.wordlist.merged.txt",
      "resolved.providers.wordlist.merged.txt"
    );

    // merging providers.merged.txt and resolved.providers.wordlist.merged.txt
    uniquefyFiles(
      ["resolved.providers.wordlist.merged.txt", "providers.merged.txt"],
      "final.merge.txt"
    );

    toBeDeletedFiles.push(
      "providers.merged.txt",
      "resolved.providers.wordlist.merged.txt"
    );

    // dnsgen for resolved parts of providers + wordlist merged result
    await dnsgen("final.merge.txt", "dnsgen.result.txt");

    console.log(
      chalk.bgWhite.black.underline(
        "[+] Running shuffleDNS on the final dnsgen result. This might take a minute or so"
      )
    );
    await shuffleDNS(domain, "dnsgen.result.txt", `final.${domain}.subs`);

    toBeDeletedFiles.push("dnsgen.result.txt", "final.merge.txt");
    toBeDeletedFiles.push(...subdomainProviders, wordlistSubFileName);
    toBeDeletedFiles.push("providers.wordlist.merged.txt");

    toBeDeletedFiles.map((file) => {
      if (fs.existsSync(file)) {
        // path exists so delete it
        fs.unlinkSync(file);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
// TODO: also merge the Resoved ones form the eariler shuffledns opeartion with the final shuffle of dnsgen

//await dnsgen("resolve_1.txt");

// files to work with in dnsgen
// Wordlist Subs + Providers Subs -> ShuffleDNS -> WordlistProviderResolved.txt -> DNSGEN
// WordlistProviderResolved.txt + Providers Subs -> DNSGEN

main();
