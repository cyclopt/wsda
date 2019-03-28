const analysis = require('../analysis');

var website_url = 'http://www.google.com'
let successful_analysis_results;
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

describe('lighthouse successful analysis', () =>{
  it('Successful analysis', () => {
    expect(Object.keys(analysis_results).sort()).toEqual(['analysis_duration','lighthouse_results']);
  });
});