import { execWrapper } from "../utilities/execWrapper.js";
import chalk from "chalk";

async function crtsh(domain) {
  try {
    const fileName = `${domain}.crtsh.txt`;
    console.log(chalk.blue("[+] Gathering subdomains using crt.sh"));
    let command = `curl -sk "https://crt.sh/?q=${domain}&output=json" | jq -r ".[].common_name,.[].name_value" | sed "s/*.//g" | sort -u > ${fileName}`;

    const res = await execWrapper(command);

    if (res) {
      console.log(chalk.green("[+] successfully saved crt.sh results"));
      return fileName;
    }
  } catch (error) {
    console.log(chalk.red(`[!] Error while fetching crt.sh: ${error}`));
  }
}
export { crtsh };
