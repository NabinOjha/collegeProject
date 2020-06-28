const fs = require('fs');
const { WordsApi, ConvertDocumentRequest } = require('asposewordscloud');
const anyFileParser = require('anyfileparser');

//parse the resume of the user and call the calback with respose after resume is parsed
const parseResume = (resume, fn, res) => {
  console.log(resume);
  const resumeType = resume.split('.')[1];
  const pathToFile = `${process.cwd()}/public/resume/${resume}`;

  if (resumeType === 'doc') {
    const apiKey = process.env.ASPOSE_API_KEY;
    const appSid = process.env.ASPOSE_APP_SID;
    let wordsApi = new WordsApi(appSid, apiKey, process.env.ASPOSE_URL);
    let request = new ConvertDocumentRequest({
      format: 'txt',
      document: fs.readFileSync(pathToFile),
    });
    wordsApi.convertDocument(request).then((result) => {
      const parsedResume = result.body.toString('utf-8');
      fn(parsedResume, res);
    });
  } else {
    anyFileParser.parseFile(
      `${process.cwd()}/public/resume/${resume}`,
      function (data) {
        console.log(data);
        fn(data, res);
      }
    );
  }
};

module.exports = parseResume;
