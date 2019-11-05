// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  firebase: {
    apiKey: "AIzaSyBfrwhRkhvF-fx8C_f4muOXCEy8BHoFots",
        authDomain: "bandaddict-1d540.firebaseapp.com",
        databaseURL: "https://bandaddict-1d540.firebaseio.com",
        projectId: "bandaddict-1d540",
        storageBucket: "bandaddict-1d540.appspot.com",
        messagingSenderId: "783306742301",
        appId: "1:783306742301:web:00346c2d7ac8cdfec9c4f4",
        measurementId: "G-5JT6GRK5CX"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
