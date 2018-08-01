// Import Handlebars runtime lib
const Handlebars = require('handlebars/runtime');
const helpers = require('handlebars-helpers')();
const register = require('handlebars-helpers').register;
// const { registerHandlebarHelpers } = require('../../some/other/place');

// Register extra helpers
register(Handlebars);
registerHandlebarHelpers(Handlebars);

/**
 * Handlebars runtime with custom helpers.
 * Used by handlebars-loader.
 */
module.exports = Handlebars;
