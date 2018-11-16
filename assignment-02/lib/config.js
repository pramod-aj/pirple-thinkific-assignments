/**
 * PAJ - 30th Aug 2018
 * Create and export environment variables - Stripe payment details, Mailgun mail information
 */

var environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    hashingSecret: 'thisIsASecret',
    maxChecks: 5
};


environments.production = {
    port: process.env.port,
    envName: 'production',
    hashingSecret: 'thisIsAlsoASecret',
    maxChecks: 5
}

//Determine which environment was passed as a command line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//Check that the current environment is one of the environment types above, if not - return the staging server ppty
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//Export environmentToExport
module.exports = environmentToExport;