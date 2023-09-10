export const ADMIN_ROLE = 'admin';
export const ADMIN_ESOEN_ROLE = 'adminEsoen';

export interface User {
    email: string;
    sub: string;
    picture: string;
    email_verified: boolean;
    token: string;
}
