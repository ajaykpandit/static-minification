const minify = require('@node-minify/core');
const gcc = require('@node-minify/google-closure-compiler');
const htmlMinifier = require('@node-minify/html-minifier');
const uglifyjs = require('@node-minify/uglify-js');
const CleanCSS = require("clean-css");
const imageOptimizationHelper = require('./imageOptimizer');
const filesize = require("filesize");
const path = require("path");

const fs = require('fs');
const MINIFY_JS_FOLDER = 'minify_js';
const MINIFY_HTML_FOLDER = 'minify_html';


// if (!fs.existsSync(MINIFY_JS_FOLDER)) {
//     fs.mkdirSync(MINIFY_JS_FOLDER);
// }

// if (!fs.existsSync(MINIFY_HTML_FOLDER)) {
//     fs.mkdirSync(MINIFY_HTML_FOLDER);
// }

const optimize = async (saveFileName, data) => {
    let beforeOptimization = Buffer.byteLength(data);
    let newData = await imageOptimizationHelper.getOptimizedImage("image/jpg", data);
    let afterOptimization = Buffer.byteLength(newData);
    console.log(
        `Image Optimization : /img - ${path.extname(saveFileName)} : Before ${beforeOptimization} : After ${afterOptimization} : ${filesize(beforeOptimization)} to ${filesize(afterOptimization)} : Compression ${Math.round(
            ((beforeOptimization - afterOptimization) / beforeOptimization) * 100
        )} %`
        )
    fs.writeFileSync(saveFileName, newData);
}


async function minifyJS(filePath) {
    return await minify({compressor: uglifyjs, input: filePath, output: filePath});
}

async function minifyHTML(filePath) {
    const html = fs.readFileSync(filePath).toString("utf-8");
    return await minify({compressor: htmlMinifier, content: html});
}

async function minifyCSS(filePath) {
    const css = fs.readFileSync(filePath).toString();
    console.log(css);
    const output =  new CleanCSS().minify(css);
    fs.writeFileSync(filePath, output.styles);
}

async function optimizeImage(imagePath) {
    let data = fs.readFileSync(imagePath);
    await optimize(imagePath, data);
}

module.exports = {
    minifyJS,
    minifyHTML,
    minifyCSS,
    optimizeImage
}

