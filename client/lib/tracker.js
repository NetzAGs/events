import { Tracker } from 'meteor/tracker';

Tracker.autorun(function() {
    let u = Meteor.user();
    let lang = "en";
    if(u && u.profile.lang) {
        lang = u.profile.lang;
    }
    accountsUIBootstrap3.setLanguage(lang);
});
