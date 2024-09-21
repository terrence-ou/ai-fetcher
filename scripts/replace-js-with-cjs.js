import fs from "fs";
import path from "path";

// Function to replace `.js` with `.cjs` in a file
function replaceJsWithCjs(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const updatedContent = content.replace(/\.js(['"])/g, ".cjs$1");
  fs.writeFileSync(filePath, updatedContent, "utf8");
  console.log(`Updated imports in ${filePath}`);
}

// Recursively process files in the CJS build directory
function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);

    if (fs.statSync(filePath).isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith(".cjs")) {
      replaceJsWithCjs(filePath);
    }
  });
}

// Start the process in the dist/cjs/libs folder
processDirectory("./dist/cjs");
