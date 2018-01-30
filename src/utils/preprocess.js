const regions = require('../metadata/regions.json');
let parsed = Object.keys(regions);
let parsed2 = Object.keys(regions[parsed[0]]);


console.log(JSON.stringify(parsed));