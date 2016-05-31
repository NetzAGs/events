import { Accounts } from 'meteor/accounts-base';

Accounts.config({
    sendVerificationEmail: true,
    forbidClientAccountCreation: false
}); 

Accounts.emailTemplates.siteName = "türmeevents";
Accounts.emailTemplates.from = "türmeevents no-reply <no-reply@tuerme.rwth-aachen.de>";
Accounts.emailTemplates.enrollAccount.subject = function(user) {
    return "Welcome, volunteer!";
};
Accounts.emailTemplates.enrollAccount.text = function(user, url) {
    let text = "Hi, " + user.profile.name + "\n\n";
    text += "You have just been registered on http://helfer.tuermefest.de/";
    let list = "";
    Events.find({closed: false}).forEach(function(evt) {
        let slots = Volunteers.find({'slot.eventId': evt._id, userId: user._id}, {sort: {'slot.startTime': 1}}).map(function(vol) {
            return "* " + vol.slot.title.en;
        }).join("\n");
        if(slots) {
            list += evt.title.en + " (" + moment(evt.date).format("D.M.YYYY") + "):\n\n" + slots + "\n\n";
        }
    });
    if(list) {
        text += " for volunteering in the following events:\n\n" + list;
    }
    text += "\nTo set your password and change your preferences, click on the following link:\n\n" + url + "\n\nThanks!\n\n";
    return text;
};
