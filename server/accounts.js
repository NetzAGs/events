import { Accounts } from 'meteor/accounts-base';

Accounts.config({
    sendVerificationEmail: true,
    forbidClientAccountCreation: false
}); 

Accounts.emailTemplates.siteName = "türmeevents";
Accounts.emailTemplates.from = "türmeevents no-reply <no-reply@tuerme.rwth-aachen.de>";
Accounts.emailTemplates.enrollAccount.subject = function(user) {
    if(user.profile.lang == "de") {
        return "Hallo, Helfer!";
    }
    return "Welcome, volunteer!";
};
Accounts.emailTemplates.enrollAccount.text = function(user, url) {
    if(user.profile.lang == "de") {
        let text = "Hallo " + user.profile.name + ",\n\n";
        text += "Du wurdest soeben auf http://helfer.tuermefest.de/";
        let list = "";
        Events.find({closed: false}).forEach(function(evt) {
            let slots = Volunteers.find({'slot.eventId': evt._id, userId: user._id}, {sort: {'slot.startTime': 1}}).map(function(vol) {
                return "* " + vol.slot.title.de;
            }).join("\n");
            if(slots) {
                list += evt.title + " (" + moment(evt.date).format("D.M.YYYY") + "):\n\n" + slots + "\n\n";
            }
        });
        if(list) {
            text += " als Helfer für die folgenden Veranstaltungen registriert:\n\n" + list;
        } else {
            text += " registriert.\n\n";
        }
        text += "Um dein Passwort einzurichten und deine Einstellungen zu ändern, klicke auf den folgenden Link:\n\n" + url + "\n\nVielen Dank!\n\n";
        return text;
    }
    let text = "Hi " + user.profile.name + ",\n\n";
    text += "You have just been registered on http://helfer.tuermefest.de/";
    let list = "";
    Events.find({closed: false}).forEach(function(evt) {
        let slots = Volunteers.find({'slot.eventId': evt._id, userId: user._id}, {sort: {'slot.startTime': 1}}).map(function(vol) {
            return "* " + vol.slot.title.en;
        }).join("\n");
        if(slots) {
            list += evt.title + " (" + moment(evt.date).format("D.M.YYYY") + "):\n\n" + slots + "\n\n";
        }
    });
    if(list) {
        text += " for volunteering in the following events:\n\n" + list;
    } else {
        text += ".\n\n";
    }
    text += "To set your password and change your preferences, click on the following link:\n\n" + url + "\n\nThanks!\n\n";
    return text;
};
