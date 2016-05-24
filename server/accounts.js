import { Accounts } from 'meteor/accounts-base';

Accounts.config({
    sendVerificationEmail: true,
    forbidClientAccountCreation: false
}); 
