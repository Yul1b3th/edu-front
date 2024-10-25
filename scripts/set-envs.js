const { writeFileSync, mkdirSync } = require("fs");

require("dotenv").config();
// console.log( process.env ) // remove this after you've confirmed it is working
const targetPath = "./src/environments/environment.ts";

const envFileContent = `
export const environment = {
  baseUrl: "${process.env["BASE_URL"]}",
  mapbox_key: "${process.env["MAPBOX_KEY"]}",
};
`;

mkdirSync("./src/environments", { recursive: true });

writeFileSync(targetPath, envFileContent);
