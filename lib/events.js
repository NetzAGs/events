import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Events = new Mongo.Collection("events");

if(Meteor.isServer) {
    Meteor.publish('events', function eventsPublication() {
        return Events.find({});
    });
}

Meteor.methods({
    'events.insert'(newEvent) {
        if(!Roles.userIsInRole(this.userId, ['system_admin'])) {
            throw new Meteor.Error('not-authorized');
        }
        Events.insert(newEvent);
    },
    'events.update'(eventId, changedEvent) {
        if(Roles.userIsInRole(this.userId, ['system_admin', 'event_admin'], eventId)) {
            Events.update({_id: eventId}, {$set: changedEvent});
        } else {
            throw new Meteor.Error('not-authorized');
        }
    },
    'events.remove'(eventId) {
        if(!Roles.userIsInRole(this.userId, ['system_admin'])) {
            throw new Meteor.Error('not-authorized');
        }
        console.log("remove event", eventId);
        Events.remove({_id: eventId});
        Tasks.remove({eventId: eventId});
        Slots.remove({eventId: eventId});
        Volunteers.remove({'slot.eventId': eventId});
    },
    'events.makeadmin'(uid, eventId) {
        if(Roles.userIsInRole(this.userId, ['system_admin', 'event_admin'], eventId)) {
            Roles.addUsersToRoles(uid, 'event_admin', eventId);
        } else {
            throw new Meteor.Error('not-authorized');
        }
    },
    'events.removeadmin'(uid, eventId) {
        if(Roles.userIsInRole(this.userId, ['system_admin', 'event_admin'], eventId)) {
            Roles.removeUsersFromRoles(uid, 'event_admin', eventId);
        } else {
            throw new Meteor.Error('not-authorized');
        }
    },
    'events.makecoordinator'(uid, eventId) {
        if(Roles.userIsInRole(this.userId, ['system_admin', 'event_admin'], eventId)) {
            Roles.addUsersToRoles(uid, 'coordinator', eventId);
        } else {
            throw new Meteor.Error('not-authorized');
        }
    },
    'events.removecoordinator'(uid, eventId) {
        if(Roles.userIsInRole(this.userId, ['system_admin', 'event_admin'], eventId)) {
            Roles.removeUsersFromRoles(uid, 'coordinatocoordinator', eventId);
        } else {
            throw new Meteor.Error('not-authorized');
        }
    }
});
