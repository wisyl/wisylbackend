'use strict';

const vogels = require('vogels');

module.exports = function (model) {
  vogels.createTables(function (err) {
    if (err) return console.log(`Error creating ${model} table.`);
    console.log(`${model} table has been created.`);
  });
}