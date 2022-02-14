import { execWrapper } from "../utilities/execWrapper.js";

async function shuffleDNS(domain, subdomains, outputFile) {
  try {
    console.log("[+] Starting shuffledns...");
    let command = `shuffledns -d ${domain} -list ${subdomains} -r ./resolver/default_resolvers.txt -silent > ${outputFile}`;

    const res = await execWrapper(command);

    if (res) {
      console.log("successfully done with shuffledns");
      //subdomainProviders.push("subfinder.txt");
    }
  } catch (error) {
    console.log("Error while running shuffledns: " + error);
  }
}

export { shuffleDNS };

//https://github.com/BonJarber/fresh-resolvers
