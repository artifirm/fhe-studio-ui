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
            oauth2LoginUrl: '/oauth2?code=',
            oauth2TokenUrl: '/api/oid-token?',
            oauth2UserInfo: '/api/oid-user-info',
        }, {
            id: 'google-example', // rename to google and add the client id and password to work
            name: 'Google',
            oauth2ClientId: "add your client id here",
            oauth2ClientPassword: "add your client password here",
            oauth2LoginUrl: "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Foauth2&scope=openid+email&response_type=code",
            oauth2TokenUrl: "https://oauth2.googleapis.com/token?redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Foauth2&grant_type=authorization_code",
            oauth2UserInfo: "https://openidconnect.googleapis.com/v1/userinfo",
            oauth2LogoutUrl: "https://oauth2.googleapis.com/revoke",
            oauth2WellKnown: "https://accounts.google.com/.well-known/openid-configuration"
        },
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
