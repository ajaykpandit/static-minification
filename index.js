const { resolve } = require('path');
const path = require('path');
const { readdir } = require('fs').promises;
const {minifyJS, minifyCSS, minifyHTML, optimizeImage} = require('./newMinifier');


async function* getFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const res = resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        yield* getFiles(res);
      } else {
        yield res;
      }
    }
  }


if (process.argv.length <= 2) {
    throw Error("Folder path is required parameter.")
}
let folderPath = process.argv[2];

//"C:\\Users\\NowFloats\\workspace\\kitsune-indiashelter-webapplication\\build\\customerlogin"
(async () => {
      for await (const file of getFiles(folderPath)) {
          let extensionName = path.extname(file);
          console.log(file);
        if (extensionName == ".js") {
            try {
                await minifyJS(file);
            } catch(e) {
                console.log(e.toString());
            }
        } else if (extensionName == ".html") {
          await minifyHTML(file)
        }
      else if (extensionName == ".css") {
        await minifyCSS(file);
      } else if (extensionName == ".png" || 
                extensionName == ".jpg" || 
                extensionName || ".jpeg" || 
                extensionName == ".svg" ||
                extensionName == ".gif"
                ) {
                    await optimizeImage(file);
                }
    }
})();