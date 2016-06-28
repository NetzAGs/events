import { Email } from 'meteor/email';

Messages = new Mongo.Collection("Messages");

if(Meteor.isServer) {
    Meteor.publish('messages', function() {
        return Messages.find({});
    });

    Meteor.methods({
        'tasks.contact'(taskId, msg) {
            if(!Meteor.userId()) {
                throw new Meteor.Error('not-signed-in');
            }
            let admins = Roles.getUsersInRole('task_admin', taskId)
                .map(function(admin) {
                    return admin.profile.name + " <" + admin.emails[0].address + ">";
                });
            let from = Meteor.user().profile.name + " <" + Meteor.user().emails[0].address + ">";
            Email.send({
                from: from,
                to: admins,
                subject: msg.subject,
                text: msg.text
            });

        },
        'messages.send'(taskId, msg) {
            if(!Roles.userIsInRole(this.userId, ['system_admin', 'task_admin'], taskId)) {
                throw new Meteor.Error('not-authorized');
            }
            msg.taskId = taskId;
            let task = Tasks.findOne({_id: taskId});
            let event = Events.findOne({_id: task.eventId});
            let slotIds = Slots.find({taskId: taskId, _id: {$in: msg.slotIds}}).map(function(slot) { return slot._id; });
            let userIds = Volunteers.find({'slot._id': {$in: slotIds}, temp: {$ne: true}})
                .map(function(vol) { return vol.userId; });
            let replyTo = [];
            if(msg.sendToTaskadmins) {
                Roles.getUsersInRole('task_admin', taskId)
                    .forEach(function(admin) {
                        userIds.push(admin._id);
                        replyTo.push(admin.profile.name + " <" + admin.emails[0].address + ">");
                    });
            }
            msg.timestamp = new Date();
            let users = Meteor.users.find({_id: {$in: userIds}});
            let sentUserIds = [];
            users.forEach(function(u) {
                sentUserIds.push(u._id);
                let from = " <no-reply@tuerme.rwth-aachen.de>";
                let to = u.profile.name + " <" + u.emails[0].address + ">";
                let subject = "";
                let text = "";
                let isAdmin = Roles.userIsInRole(u, 'task_admin', taskId);
                let mySlots = null;
                if(!isAdmin) {
                    let mySlotIds = Volunteers.find({'slot._id': {$in: slotIds}, temp: {$ne: true}, userId: u._id}, {sort: {startTime: 1}}).map(function(vol) { return vol.slot._id; });
                    mySlots = Slots.find({_id: {$in: mySlotIds}}, {sort: {startTime: 1}});
                }
                if(u.profile.lang == "de") {
                    from = event.title + " " + task.title.de + from;
                    subject = msg.subject.de;
                    text += msg.body.de + "\n\n----\n"
                        + "Du bekommst diese E-Mail, weil du auf http://helfer.tuermefest.de/ ";
                    if(isAdmin) {
                        text += "als Aufgabenadmin für " + task.title.de;
                    } else {
                        text += "als Helfer für "
                            + mySlots.map(function(s) { return s.title.de; }).join(", ");
                    }
                    text += " eingetragen bist.\n"
                        + "Besuche das Helferportal, um alle deine Aufgaben einzusehen oder zu ändern.";
                } else {
                    from = event.title + " " + task.title.en + from;
                    subject = msg.subject.en;
                    text += msg.body.en + "\n\n----\n"
                        + "You are getting this email, because you are registered ";
                    if(isAdmin) {
                        text += "as a task admin for " + task.title.en;
                    } else {
                        text += "as a volunteer for "
                            + mySlots.map(function(s) { return s.title.en; }).join(", ");
                    }
                    text += " on http://helfer.tuermefest.de/.\n"
                        + "Visit this website to view and modify all your tasks.";
                }
                Email.send({
                    from: from,
                    to: u.profile.name + " <" + u.emails[0].address + ">",
                    replyTo: replyTo,
                    subject: subject,
                    text: text
                });
            });
            msg.sentTo = sentUserIds;
            Messages.insert(msg);
        },
        'messages.sendEventMessage'(eventId, msg) {
            if(!Roles.userIsInRole(this.userId, ['system_admin', 'event_admin'], eventId)) {
                throw new Meteor.Error('not-authorized');
            }
            msg.eventId = eventId;
            let event = Events.findOne({_id: eventId});
            let userIds = [];
            let replyTo = [];
            Roles.getUsersInRole('event_admin', eventId)
                .forEach(function(admin) {
                    replyTo.push(admin.profile.name + " <" + admin.emails[0].address + ">");
                });
            if(msg.sendToChecked) {
                Volunteers.find({'slot.eventId': eventId, temp: {$ne: true}, checkedIn: true})
                    .forEach(function(vol) {
                        userIds.push(vol.userId);
                    });
            }
            if(msg.sendToUnchecked) {
                Volunteers.find({'slot.eventId': eventId, temp: {$ne: true}, checkedIn: false})
                    .forEach(function(vol) {
                        userIds.push(vol.userId);
                    });
            }
            if(msg.sendToCoordinators) {
                Roles.getUsersInRole('coordinator', eventId)
                    .forEach(function(coordinator) {
                        userIds.push(coordinator._id);
                    });
            }
            msg.timestamp = new Date();
            let users = Meteor.users.find({_id: {$in: userIds}});
            let sentUserIds = [];
            users.forEach(function(u) {
                sentUserIds.push(u._id);
                let from = " <no-reply@tuerme.rwth-aachen.de>";
                let to = u.profile.name + " <" + u.emails[0].address + ">";
                let subject = "";
                let text = "";
                let isCoordinator = Roles.userIsInRole(u, 'coordinator', eventId);
                if(u.profile.lang == "de") {
                    from = event.title + from;
                    subject = msg.subject.de;
                    text = msg.body.de;
                } else {
                    from = event.title + from;
                    subject = msg.subject.en;
                    text = msg.body.en;
                }
                Email.send({
                    from: from,
                    to: u.profile.name + " <" + u.emails[0].address + ">",
                    replyTo: replyTo,
                    subject: subject,
                    text: text
                });
            });
            msg.sentTo = sentUserIds;
            Messages.insert(msg);
            console.log("sent to", sentUserIds.join(', '));
        }
    });
}

Messages.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
