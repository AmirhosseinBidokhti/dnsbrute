import { exec } from "child_process";

function execWrapper(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`error: ${error.message}`);
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
      }
      resolve(true);
    });
  });
}

export { execWrapper };

// function execSyncWrapper(command) {
//   return new Promise((resolve, reject) => {
//     execSync(command, (error, stdout, stderr) => {
//       if (error) {
//         reject(`error: ${error.message}`);
//       }
//       if (stderr) {
//         reject(`stderr: ${stderr}`);
//       }
//       resolve(true);
//     });
//   });
// }
