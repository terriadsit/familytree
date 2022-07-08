const { defineConfig } = require("cypress");

const admin = require("firebase-admin");
const cypressFirebasePlugin = require("cypress-firebase").plugin;

// module.exports = (on, config) => {
//   const extendedConfig = cypressFirebasePlugin(on, config, admin);

//   // Add other plugins/tasks such as code coverage here

//   return extendedConfig;
// };
module.exports = defineConfig({
  env: {
    // TEST_UID used by cy.login() unless cy.login() is passed arguments
    TEST_UID: "Yp0pa3HmNLb9Nn3PPGckKRrnnVB2",
    PERSON_ID: "Q6QeWPIAToKj422Yyxrl",
    EMAIL: "familyTree100@dispostable.com",
    DISPLAY_NAME: "test",
    UNVERIFIED: "test_unverified@mailinator.com",
    PASSWORD: "testing123"
  },
  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
    
  },

  e2e: {
    setupNodeEvents(on, config) {
      
      const extendedConfig = cypressFirebasePlugin(on, config, admin);

      // Add other plugins/tasks such as code coverage here

       return extendedConfig;
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000"
  },
});
