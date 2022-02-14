import fs from "fs";

function writeArrayToFile(array, outputFile) {
  const writeStream = fs.createWriteStream(`${outputFile}.txt`);
  const pathName = writeStream.path;

  // write each value of the array on the file breaking line
  array.forEach((value) => writeStream.write(`${value}\n`));

  // the finish event is emitted when all data has been flushed from the stream
  writeStream.on("finish", () => {
    console.log(`wrote all the array data to ${pathName}`);
  });

  // handle the errors on the write process
  writeStream.on("error", (err) => {
    console.error(`There is an error writing to ${pathName} => ${err}`);
  });

  // close the stream
  writeStream.end();
}

export default writeArrayToFile;

///////////////////////////////

// const arg = process.argv.slice(2);
// const wordlist = arg[0];

// import { dirname } from "path";
// import { fileURLToPath } from "url";

// const __dirname = dirname(fileURLToPath(import.meta.url));

// const wordlistPath = `${__dirname}/${wordlist}`;

// const domain = "domain.tld";
// var text = fs.readFileSync(wordlistPath, "utf-8");
// var array = [];
// var textByLine = text.split("\r\n");
// textByLine.map((sub) => {
//   array.push(`${sub}.${domain}`);
// });

//writeArrayToFile(array, "subdomainGeneratorResult");
