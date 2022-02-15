// import chalk from "chalk";
// import { execWrapper } from "../utilities/execWrapper.js";

// async function dnsgen(mergeSubdomains, outputFile) {
//   try {
//     console.log(chalk.blue("[+] Starting the DNSGEN..."));
//     const command = `cat ${mergeSubdomains} | dnsgen - | sort -u > ${outputFile}`;
//     const res = await execWrapper(command);
//     if (res) {
//       console.log(
//         chalk.green(`[+] Successfully ran DNSGEN, results in ${outputFile}`)
//       );
//     }
//   } catch (error) {
//     console.log(chalk.red("[!] Error in DNSGEN: " + error));
//   }
// }

// export { dnsgen };

// // DNSGEN Alternatives/Extended ones (?)
// // Adding them below

import chalk from "chalk";
import { execWrapper } from "../utilities/execWrapper.js";

function dnsgen(mergeSubdomains, outputFile) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(chalk.blue("[+] Starting the DNSGEN..."));
      const command = `cat ${mergeSubdomains} | dnsgen - | sort -u > ${outputFile}`;
      const res = await execWrapper(command);
      if (res) {
        console.log(
          chalk.green(`[+] Successfully ran DNSGEN, results in ${outputFile}`)
        );
        resolve(outputFile);
      }
    } catch (error) {
      console.log(chalk.red("[!] Error in DNSGEN: " + error));
    }
  });
}

export { dnsgen };

// DNSGEN Alternatives/Extended ones (?)
// Adding them below
