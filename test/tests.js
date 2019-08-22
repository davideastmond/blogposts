// Using mocha/chai/chai-as-promised to perform routes tests

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const axios = require('axios');
chai.use(chaiAsPromised);
