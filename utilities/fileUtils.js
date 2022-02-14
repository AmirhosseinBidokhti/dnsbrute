import chalk from "chalk";
import { execSync } from "child_process";
import { readFileSync, createWriteStream, unlinkSync } from "fs";
function writeArrayToFile(array, outputFile) {
  const writeStream = createWriteStream(`${outputFile}.txt`);
  const pathName = writeStream.path;

  // write each value of the array on the file breaking line
  array.forEach((value) => writeStream.write(`${value}\n`));

  // the finish event is emitted when all data has been flushed from the stream
  writeStream.on("finish", () => {
    console.log(chalk.green(`[+] Wrote all the array data to ${pathName}`));
  });

  // handle the errors on the write process
  writeStream.on("error", (err) => {
    console.log(
      chalk.red(`[!] There is an error writing to ${pathName} => ${err}`)
    );
    return;
  });

  // close the stream
  writeStream.end();
}

function readFileToArray(file) {
  // const filePath = `${__dirname}/${file}`;
  var text = readFileSync(file, "utf-8");
  var textByLine = text.split("\r\n");
  return textByLine;
}

//const x = readFileToArray("./abuseipdb.txt"); Works
//const x = readFileToArray("abuseipdb.txt"); Works
//const x = readFileToArray("../abuseipdb.txt"); Works
// Cool!

//let command = `cat ${file} | sort -u > ${outputFile}`
function uniquefyFiles(files, outputFile) {
  files.map(async (file) => {
    let command = `cat ${file} >> tempUnique`;
    execSync(command);
  });

  let command = `cat tempUnique | sort -u > ${outputFile}`;
  execSync(command);
  unlinkSync("tempUnique");
  //execSync("rm -rf tempUnique");
}

export { writeArrayToFile, readFileToArray, uniquefyFiles };
