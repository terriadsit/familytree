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
    TEST_UID: "MnsICqG2ehSrvhU5jXu9Pnox0Lv2",
    PERSON_ID: "Q6QeWPIAToKj422Yyxrl"
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
    baseUrl: "http://localhost:3001"
  },
});
