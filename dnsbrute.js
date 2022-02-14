import fs from "fs";
import { dnsgen } from "./dnsgen/dnsgen.js";
import { shuffleDNS } from "./resolver/shuffledns.js";
import { uniquefyFiles } from "./utilities/fileUtils.js";
import { subdomainGenerator } from "./utilities/subdomainGenerator.js";

import { abuseipdb } from "./providers/abuseipdb.js";
import { crtsh } from "./providers/crtsh.js";
import { subfinder } from "./providers/subfinder.js";

const subdomainProviders = [];

import { Command } from "commander";
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

console.log(domain);
console.log(wordlist);

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

    // ShuffleDNS providers.gen_subs.txt (providers + wordlist generated subdomains)
    await shuffleDNS(
      domain,
      "providers.wordlist.merged.txt",
      "resolved.providers.wordlist.merged.txt"
    );

    // DNSGEN for resolved parts of providers + wordlist merged result

    // merging providers.merged.txt and resolved.providers.wordlist.merged.txt
    uniquefyFiles(
      ["resolved.providers.wordlist.merged.txt", "providers.merged.txt"],
      "final.merge.txt"
    );

    dnsgen("final.merge.txt", "dnsgen.result.txt");

    subdomainProviders.map((subdomainProvider) => {
      if (fs.existsSync(subdomainProvider)) {
        // path exists so delete it
        fs.unlinkSync(subdomainProvider);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

//await dnsgen("resolve_1.txt");

// files to work with in dnsgen
// Wordlist Subs + Providers Subs -> ShuffleDNS -> WordlistProviderResolved.txt -> DNSGEN
// WordlistProviderResolved.txt + Providers Subs -> DNSGEN

main();
