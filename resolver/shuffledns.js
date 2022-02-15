import { execWrapper } from "../utilities/execWrapper.js";
import chalk from "chalk";

async function shuffleDNS(domain, subdomains, outputFile) {
  try {
    console.log(chalk.blue("[+] Starting the shuffleDNS..."));
    let command = `shuffledns -d ${domain} -list ${subdomains} -r ./resolver/default_resolvers.txt -silent > ${outputFile}`;

    const res = await execWrapper(command);
    if (res) {
      console.log(
        `[+] Successfully ran the shuffleDNS; Results save to ${outputFile}`
      );
    }
  } catch (error) {
    console.log(`[!] Error while running shuffleDNS: ${error}`);
  }
}

export { shuffleDNS };

//https://github.com/BonJarber/fresh-resolvers
