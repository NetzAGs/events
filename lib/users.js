import { Accounts } from 'meteor/accounts-base';

if(Meteor.isServer) {
    Meteor.publish('users', function() {
        if(
                Roles.userIsInRole(this.userId, 'system_admin')
                || Roles.getGroupsForUser(this.userId, 'event_admin').length
                || Roles.getGroupsForUser(this.userId, 'task_admin').length
                || Roles.getGroupsForUser(this.userId, 'coordinator').length
          ) {
            return Meteor.users.find({});
        }
    });
}

Meteor.methods({
    'system.makeadmin'(uid) {
        if(Roles.userIsInRole(this.userId, 'system_admin')) {
            Roles.addUsersToRoles(uid, 'system_admin', Roles.GLOBAL_GROUP);
        }
    },
    'system.removeadmin'(uid) {
        if(Roles.userIsInRole(this.userId, 'system_admin')) {
            Roles.removeUsersFromRoles(uid, 'system_admin', Roles.GLOBAL_GROUP);
        }
    },
    'users.update'(uid, updatedUser) {
        if(Meteor.isServer) {
            if(this.userId == uid || Roles.userIsInRole(this.userId, 'system_admin')) {
                Meteor.users.update({_id: uid}, {$set: {profile: updatedUser.profile}});

                let thisuser = Meteor.users.findOne({_id: uid});
                let oldEmail = false;
                if(thisuser.emails.length) {
                    oldEmail = (thisuser.emails[0]).address;
                    if(oldEmail == updatedUser.email) {
                        return;
                    }
                }
                try {
                    Accounts.addEmail(uid, updatedUser.email);
                    if(oldEmail) {
                        Accounts.removeEmail(uid, oldEmail);
                    }
                    if(this.userId == uid) {
                        Accounts.sendVerificationEmail(uid);
                    } else {
                        Accounts.sendEnrollmentEmail(uid);
                    }
                } catch(e) {
                    throw new Meteor.Error('Email already taken');
                }
            }
        }
    }
});

Meteor.users.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
