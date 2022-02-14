import { readFileToArray, writeArrayToFile } from "./fileUtils.js";

function subdomainGenerator(domain, wordlist) {
  const fileName = `${domain}.subgenerator`;
  return new Promise((resolve, reject) => {
    let subdomains = [];
    let words = readFileToArray(wordlist);
    words.map((word) => {
      subdomains.push(`${word}.${domain}`);
    });

    writeArrayToFile(subdomains, fileName);
    //subdomainProviders.push("subdomainGeneratorRes.txt");
    resolve(`${fileName}.txt`);
  });
}

export { subdomainGenerator };
