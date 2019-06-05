'use strict';

const vogels = require('vogels');

module.exports = function (options) {
  const tableName = Object.keys(options)[0];
  vogels.createTables(options, function (err) {
    if (err) return console.log(`Error creating ${tableName} table.`);
    console.log(`${tableName} table has been created.`);
  });
}