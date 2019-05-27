'use strict';

const vogels = require('vogels');

module.exports = function (model) {
  vogels.createTables(function (err) {
    if (err) {
      console.log(`Error creating ${model} table: `, err);
      //return process.exit(1);
      return;
    }
    console.log(`${model} table has been created`);
  });
}