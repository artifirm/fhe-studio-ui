// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiUrl: 'api/',
    oauth2ClientId:"not-set",
    oauth2ClientPassword:"not-set",
    oauth2LoginUrl: "/oauth2?code=123",
    oauth2TokenUrl: "/dev-token?",
    oauth2UserInfo: "/dev-user",
    oauth2LogoutUrl: "https://oauth2.googleapis.com/revoke",
    oauth2WellKnown:"https://accounts.google.com/.well-known/openid-configuration"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
