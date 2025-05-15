module.exports = { 
  schemaFile: './spec/openapi.json', 
  apiFile: './src/store/emptyApi.ts', 
  apiImport: 'emptySplitApi', 
  outputFile: './src/store/travelApi.ts', 
  exportName: 'travelApi', 
  hooks: true, 
  exportLazy: true,
};