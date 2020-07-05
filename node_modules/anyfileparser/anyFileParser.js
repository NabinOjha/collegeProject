const fs = require('fs')
const Tesseract = require('tesseract.js');
const pdf = require('pdf-parse');
const officeParser = require('officeparser');


function parseFile(filename, callback) {
    var myExtension = filename.split('.').pop().toLowerCase();

    if(myExtension == "bmp" || myExtension == "pnm" || myExtension == "png" || myExtension == "jfif" || myExtension == "jpg" || myExtension == "jpeg" || myExtension == "tiff") {
        Tesseract.recognize(filename)
        .then((result) => {
            callback(result.text)
        });
    }
    else if(myExtension == "pdf") {
        var dataBuffer = fs.readFileSync(filename);
        
        pdf(dataBuffer)
        .then((data) => {
            callback(data.text);
        })
    }
    else if(myExtension == "docx" || myExtension == "pptx" || myExtension == "xlsx" || myExtension == "odt" || myExtension == "odp" || myExtension == "ods") {
        officeParser.parseOffice(filename, (result) => {
            callback(result);
        })
    }
    else {
        callback(fs.readFileSync(filename, 'utf-8').toString());
    }
}

// #region setDecompressionLocation
function setDecompressionLocation(newLocation) {
    officeParser.setDecompressionLocation(newLocation);
}

// #endregion setDecompressionLocation


module.exports.parseFile = parseFile;
module.exports.setDecompressionLocation = setDecompressionLocation;


