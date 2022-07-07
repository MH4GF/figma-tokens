import {
  MessageFromPluginTypes
} from '../../src/types/messages';
import {
  StorageProviderType
} from '../../src/constants/StorageProviderType';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('receiveStorageTypeLocal', () => {
  cy.window().then(($window) => {
    const message = {
      pluginMessage: {
        type: MessageFromPluginTypes.RECEIVED_STORAGE_TYPE,
        storageType: {
          provider: StorageProviderType.LOCAL
        },
      },
    };
    $window.postMessage(message, '*');
  });
});

Cypress.Commands.add('receiveStorageType', (storageType) => {
  cy.window().then(($window) => {
    const message = {
      pluginMessage: {
        type: MessageFromPluginTypes.RECEIVED_STORAGE_TYPE,
        storageType,
      },
    };
    $window.postMessage(message, '*');
  });
});

Cypress.Commands.add('receiveApiProviders', (providers) => {
  cy.window().then(($window) => {
    const message = {
      pluginMessage: {
        type: MessageFromPluginTypes.API_PROVIDERS,
        providers,
      },
    };
    $window.postMessage(message, '*');
  });
});

Cypress.Commands.add('receiveTokenValues', (values) => {
  cy.window().then(($window) => {
    const message = {
      pluginMessage: {
        type: MessageFromPluginTypes.TOKEN_VALUES,
        values,
        userData: {}
      },
    };
    $window.postMessage(message, '*');
  });
});

Cypress.Commands.add('receiveSetTokens', (values) => {
  cy.window().then(($window) => {
    const message = {
      pluginMessage: {
        type: MessageFromPluginTypes.SET_TOKENS,
        values,
      },
    };
    $window.postMessage(message, '*');
  });
});

Cypress.Commands.add('apiCredentials', (values) => {
  cy.window().then(($window) => {
    const message = {
      pluginMessage: {
        type: MessageFromPluginTypes.API_CREDENTIALS,
        status: true,
        credentials: values,
      },
    };
    $window.postMessage(message, '*');
  });
});

Cypress.Commands.add('receiveSelectionValues', () => {
  cy.window().then(($window) => {
    const message = {
      pluginMessage: {
        type: MessageFromPluginTypes.SELECTION,
        selectionValues: [{
            category: "sizing",
            type: "sizing",
            value: "sizing.xs",
            nodes: [{
              id: "3425:3",
              name: "Rectangle 2",
              type: "RECTANGLE",
            }],
          },
          {
            category: "opacity",
            type: "opacity",
            value: "opacity.50",
            nodes: [{
              id: "3425:3",
              name: "Rectangle 2",
              type: "RECTANGLE",
            }],
          },
          {
            category: "fontSizes",
            type: "fontSizes",
            value: "font-size.12",
            nodes: [{
              id: "3425:3",
              name: "Rectangle 2",
              type: "RECTANGLE",
            }],
          },
        ],
        selectedNodes: 1,
        mainNodeSelectionValues: {
          sizing: "sizing.xs",
          opacity: "opacity.50",
          fontSizes: "font-size.12",
        }
      },
    };
    $window.postMessage(message, '*');
  });
})