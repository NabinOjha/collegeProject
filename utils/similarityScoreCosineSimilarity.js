//Implementation of cosine similarity algorithm based on string comparison
//call with array of job to find the similarity between the job and the userResume
//call with array of jobs to find the text similarity between the each job and the user
const cosineSimilarityFn = (user, userResume, job) => {
  let resume = `${userResume} userId=${user._id}`;
  const resumeDoc = { resume };

  const documentsArray = [];
  for (let jobEl of job) {
    let jobItem = JSON.stringify(jobEl);
    jobItem = JSON.parse(jobItem);
    documentsArray.push(jobItem);
  }

  //push the resume into all the documents so that tf,idf& tf-idf can be calculated
  documentsArray.push(resumeDoc);

  //calculate tf
  //Number or times the word appears in a document : tf
  const tfArray = [];
  for (let document of documentsArray) {
    const jobObjWithCount = {};
    for (let doc of Object.values(document)) {
      const stringifiedValues = doc.toString();
      const newValue = stringifiedValues.split(/\W+/);
      newValue.forEach((el) => {
        let element = el.toLowerCase();
        if (!jobObjWithCount[element]) {
          jobObjWithCount[element] = 1;
        } else {
          jobObjWithCount[element] = jobObjWithCount[element] + 1;
        }
      });
    }
    tfArray.push(jobObjWithCount);
  }

  //normalize the term frequency
  //normalized tf = tf/total words in a document
  const normalizedTf = [];
  for (let i = 0; i < tfArray.length; i++) {
    const documentWordsCount = Object.keys(tfArray[i]).length;
    for (let key in tfArray[i]) {
      tfArray[i][key] = (tfArray[i][key] / documentWordsCount).toFixed(8);
    }
    normalizedTf.push(tfArray[i]);
  }

  //IDF log(total number of documents /Number of documents with term t in it)
  const documentNumber = documentsArray.length;
  const allWordsDocArray = [];
  const objWithAllDocWords = {};

  for (let i = 0; i < documentsArray.length; i++) {
    const docWordsArray = [];
    for (let doc of Object.values(documentsArray[i])) {
      const stringifiedValues = doc.toString();
      const newValue = stringifiedValues.split(/\W+/);
      newValue.forEach((el) => {
        let element = el.toLowerCase();
        if (!allWordsDocArray.includes(element)) {
          allWordsDocArray.push(element);
        }
        if (!docWordsArray.includes(element)) {
          docWordsArray.push(element);
        }
      });
    }
    objWithAllDocWords[i + 1] = docWordsArray;
  }

  const idfObj = {};
  for (let i = 0; i < allWordsDocArray.length; i++) {
    const word = allWordsDocArray[i].toLowerCase();
    for (value of Object.values(objWithAllDocWords)) {
      if (value.includes(word)) {
        if (idfObj[word]) {
          idfObj[word] = idfObj[word] + 1;
        } else {
          idfObj[word] = 1;
        }
      }
    }
  }
  const normalizedIdf = {};
  //normalized idfscores
  for (let [key, value] of Object.entries(idfObj)) {
    normalizedIdf[key] = Math.log(documentNumber / value).toFixed(8);
  }

  //tf-idf
  //tf *idf for each term
  const tfIdf = [...normalizedTf];
  tfIdf.forEach((doc) => {
    for (let [key, value] of Object.entries(doc)) {
      doc[key] = (normalizedIdf[key] * doc[key]).toFixed(8);
    }
  });

  //resume with tfidf scores calculated
  let resumeWithTfIdf = tfIdf.find((el) => {
    if (el.userid && el[`${user._id}`]) return true;
  });

  //other documents with tfidf scores calculated
  const documentsToCompare = tfIdf.filter((el) => {
    if (!(el.userid && el[`${user._id}`])) return true;
  });

  delete resumeWithTfIdf.userid;
  delete resumeWithTfIdf[`${user._id}`];

  const similarityScoresObj = {};

  for (let i = 0; i < documentsToCompare.length; i++) {
    const docToCompare = documentsToCompare[i];
    // calculate the similarity with each document
    const dict = [];
    for (let key of Object.keys(resumeWithTfIdf)) {
      dict.push(key);
    }
    for (let key of Object.keys(docToCompare)) {
      if (!dict.includes(key)) {
        dict.push(key);
      }
    }

    function mapDocWordsToVector(dict, doc) {
      const vec = [];
      dict.forEach((el) => {
        if (doc[el]) {
          vec.push(doc[el]);
        } else {
          vec.push(0);
        }
      });
      return vec;
    }

    //convert the idf scores for both document into vectors
    const vectorA = mapDocWordsToVector(dict, resumeWithTfIdf);
    const vectorB = mapDocWordsToVector(dict, docToCompare);

    //calculate magnituve of both vectors
    function vectorProduct(vecA, vecB) {
      let product = 0;
      for (let i = 0; i < vecA.length; i++) {
        product = product + vecA[i] * vecB[i];
      }
      return product;
    }
    //calculate magnitude of given vector
    function magnitude(vector) {
      let sum = 0;
      for (let i = 0; i < vector.length; i++) {
        sum = sum + vector[i] * vector[i];
      }
      return Math.sqrt(sum);
    }

    //cosine similarity : (vectorA.VectorB)/(magnitude(vectorA)*magnitude(vectorB))
    function calculateCosineSimilarity(vecA, vecB) {
      return vectorProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
    }

    const cosineSimilarity = calculateCosineSimilarity(vectorA, vectorB);
    similarityScoresObj[documentsArray[i]._id] = cosineSimilarity;
  }

  //sort the jobs based on cosine similarity
  const sortableArray = [];
  for (let [key, value] of Object.entries(similarityScoresObj)) {
    sortableArray.push([key, value]);
  }

  sortableArray.sort((a, b) => {
    return b[1] - a[1];
  });

  const soretdObj = {};
  for (let i = 0; i < sortableArray.length; i++) {
    soretdObj[sortableArray[i][0]] = sortableArray[i][1];
  }
  console.log('............ Job Score ..........',soretdObj);
  return soretdObj;
};

module.exports = cosineSimilarityFn;
