const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "..", "src");
const stylesDir = path.join(__dirname, "..", "styles");
const distDir = path.join(__dirname, "..", "dist");

function removeDirectory(directory) {
  if (fs.existsSync(directory)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });

  const items = fs.readdirSync(source);

  for (const item of items) {
    const sourcePath = path.join(source, item);
    const destinationPath = path.join(destination, item);

    const stats = fs.statSync(sourcePath);

    if (stats.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

function fixHtmlPaths(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);

    if (fs.statSync(filePath).isDirectory()) {
      fixHtmlPaths(filePath);
      continue;
    }

    if (file.endsWith(".html")) {
      let content = fs.readFileSync(filePath, "utf8");

      content = content.replaceAll('../styles/', 'styles/');

      fs.writeFileSync(filePath, content);
    }
  }
}

removeDirectory(distDir);

copyDirectory(srcDir, distDir);

const distStylesDir = path.join(distDir, "styles");

copyDirectory(stylesDir, distStylesDir);

fixHtmlPaths(distDir);

console.log("Build completed successfully.");
console.log("Output directory: dist/");