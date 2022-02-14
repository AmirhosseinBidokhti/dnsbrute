import { execWrapper } from "../utilities/execWrapper.js";
import chalk from "chalk";
async function abuseipdb(domain) {
  try {
    const fileName = `${domain}.abuseipdb.txt`;
    console.log(chalk.blue("[+] Gathering subdomains using abuseipdb"));
    let command = `curl -s https://www.abuseipdb.com/whois/${domain} -H "user-agent: Chrome" | grep -E "<li>\\w.*</li>"| sed -E "s/<\\/?li>//g" | sed -e "s/$/.${domain}/" | sort -u > ${fileName}`;

    const res = await execWrapper(command);

    if (res) {
      console.log(chalk.green("[+] successfully saved abuseipdb results"));
      return fileName;
    }
  } catch (error) {
    console.log(chalk.red(`[!] Error while fetching abuseipdb: ${error}`));
  }
}

export { abuseipdb };
