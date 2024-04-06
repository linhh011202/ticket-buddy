# Ticketbuddy

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.5.

## Installation
0. [Download and install Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm "Downloading and installing Node.js and npm").
1. Clone the project.
2. Install libraries using `npm install`

## Set up
Create a file 'env-prod.ts' under './src/environments'.

#### 1. Ticketmaster
1. [Get an API key from Ticketmaster](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/ "The Ticketmaster Developer Portal").
2. Add the following line into `env-prod.ts` with the ticket master api key.\
`export const ticketMasterApi = "your-ticket-master-api-key";`

#### 2. Firebase config
1. [Create a new Firebase project](console.firebase.google.com "Firebase console").
2. Add Firebase to your Web App.
3. Ignore any npm install commands, this is already completed earlier.
4. Copy the `firebaseConfig` provided.
5. Paste the config into `env-prod.ts` with the `export` keyword. It should look like the following.\
`export const firebaseConfig = {`\
` apiKey: "your-proj-api-key",`\
` authDomain: "your-proj-id.firebaseapp.com",`\
`  projectId: "your-proj-id",`\
`  storageBucket: "your-proj-id.appspot.com",`\
`  messagingSenderId: "XXXXXXXXXXXX",`\
`  appId: "1:XXXXXXXXXXXX:web:XXXXXXXXXXXXXXXXXXXXXXXX",`\
`  measurementId: "G-XXXXX"`\
`};`\

#### 3. Firebase Authentication set up
1. [Open firebase console](console.firebase.google.com "Firebase console"), navigate to the project created earlier.
2. Select Authentication. 
3. Enable Google as a sign-in provider.

#### 4. Firebase Firestore set up
1. [Open firebase console](console.firebase.google.com "Firebase console"), navigate to the project created earlier.
2. Create Cloud Firestore database in test mode.
3. Under Extensions, install the "Trigger Email from Firestore" extension.

## Running the project
Run the project using `npm start`

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
