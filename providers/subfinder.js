import { execWrapper } from "../utilities/execWrapper.js";
import chalk from "chalk";

async function subfinder(domain) {
  try {
    const fileName = `${domain}.subfinder.txt`;
    console.log(chalk.blue("[+] Gathering subdomains using subfinder"));
    let command = `subfinder -d ${domain} -nC -silent > ${fileName}`;

    const res = await execWrapper(command);

    if (res) {
      console.log(chalk.green("[+] successfully saved subfinder results"));
      return fileName;
    }
  } catch (error) {
    console.log(chalk.red(`[!] Error while fetching subfinder: ${error}`));
  }
}

export { subfinder };
