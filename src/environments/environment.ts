// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiUrl: 'api/',
    authProviders: [
        {
            id: 'dev',
            name: 'Test Demo User',
            oauth2ClientId: 'not-set',
            oauth2ClientPassword: 'not-set',
            oauth2LoginUrl: '/oauth2?code=dev-code',
            oauth2TokenUrl: '/dev-token?',
            oauth2UserInfo: '/dev-user',
        }, {
            id: 'fheStudio',
            name: 'Log In',
            oauth2ClientId: 'not-set',
            oauth2ClientPassword: 'not-set',
            oauth2LoginUrl: '/oauth2?code=fhe',
            oauth2TokenUrl: '/api/oid-token?',
            oauth2UserInfo: '/api/oid-user-info',
        }
    ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
