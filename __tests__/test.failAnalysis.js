const analysis = require('../analysis');

var website_url = 'www.google.com'
let analysis_results;
let fail_analysis_results;

jest.setTimeout(250 * 1000);

beforeAll(async () => {
  await analysis.runAnalysis(website_url).then(results =>{
    analysis_results = results;
  })
  .catch(err =>{
    analysis_results = err;
  });
});

describe('lighthouse failed analysis', () =>{
  it('Failed analysis', () => {
    expect(Object.keys(analysis_results).sort()).toEqual(['LighthouseError']);
  });
});