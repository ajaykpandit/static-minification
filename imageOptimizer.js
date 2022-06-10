const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const imageminGif = require("imagemin-giflossy");
const imageminSvg = require("imagemin-svgo");
const { extendDefaultPlugins } = require("svgo");

const maxFileSize =  1000000;

exports.getOptimizedImage = async (imageType, body) => {
    if (!Buffer.isBuffer(body)) {
        return Promise.reject(new TypeError("Expected a buffer Input."));
    }

    const compressedImage = await imagemin
        .buffer(body, {
            plugins: [
                imageminJpegtran({ quality: [40] }),
                imageminPngquant({
                    quality: getQualityFactor(Buffer.byteLength(body)),
                }),
                imageminGif({
                    quality: getQualityFactor(Buffer.byteLength(body)),
                }),
                imageminSvg({
                    plugins: extendDefaultPlugins([
                        { name: "minifyStyles", active: false },
                        { name: "inlineStyles", active: false },
                        { name: "removeViewBox", active: false },
                        { name: "collapseGroups", active: false },
                    ]),
                    quality: getQualityFactor(Buffer.byteLength(body)),
                }),
            ],
        })
        .then((compressedBody) => {
            //Return the optimized file only if the size is reduced from the original image
            if (Buffer.byteLength(body) < Buffer.byteLength(compressedBody)) {
                return body;
            } else {
                return compressedBody;
            }
        })
        .catch((err) => {
            console.log("Unable to minify the image", err);
            return body;
        });
    return compressedImage;
};

// module.export = { getOptimizedImage: getOptimizedImage };

// TODO:
// 5MB > 50 %
// Max Optimized file Size to be configurable
// CMS domian images are optimizing
// Keep fixed comparison

const getQualityFactor = (imageSize) => {
    if (imageSize > maxFileSize) {
        return [0.1, 0.5];
    } else if (imageSize < maxFileSize && imageSize > maxFileSize / 2) {
        return [0.3, 0.6];
    } else {
        return [0.5, 0.7];
    }
};

function toArrayBuffer(myBuf) {
    var myBuffer = new ArrayBuffer(myBuf.length);
    var res = new Uint8Array(myBuffer);
    for (var i = 0; i < myBuf.length; ++i) {
        res[i] = myBuf[i];
    }
    return myBuffer;
}


