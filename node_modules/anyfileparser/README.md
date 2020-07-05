# anyFileParser
Node.JS library that can parse text from any kind of file, eg. text, image, pdf, office files.


#### Update
* 2019/06/17 - Added method to change location for decompressing office files in places with restricted write access.
* 2019/05/02 - Initial module with pdf, image, utf-8 and office files.



## Install via npm


```
npm i anyfileparser
```

----------

**Usage**
```
const anyFileParser = require('anyfileparser');

anyFileParser.parseFile("/path/to/file", function(data){
        // "data" string in the callback here is the text parsed from the file passed in the first argument above
        console.log(data)
})

```

*Optionally change decompression location for office Files at persionalised locations for environments with restricted write access*

```
const anyFileParser = require('anyfileparser');

// Default decompress location for office Files is "officeDist" in the directory where Node is started. 
// Put this file before parseOffice method to take effect.
anyFileParser.setDecompressionLocation("/tmp");  // New decompression location would be "/tmp/officeDist"

// P.S.: Setting location on a Windows environment with '\' heirarchy requires to be entered twice '\\'
anyFileParser.setDecompressionLocation("C:\\tmp");  // New decompression location would be "C:\tmp\officeDist"

anyFileParser.parseFile("/path/to/file", function(data){
        // "data" string in the callback here is the text parsed from the file passed in the first argument above
        console.log(data)
})

```


**Example**
```
const anyFileParser = require('anyfileparser');

anyFileParser.parseFile("C:\\files\\myText.docx", function(data){
        var newText = data + "look, I can parse any file"
        callSomeOtherFunction(newText);
})

// Using relative path for file is also fine
anyFileParser.parseFile("files/myWorkSheet.ods", function(data){
        var newText = data + "look, I can parse any file"
        callSomeOtherFunction(newText);
})
```

