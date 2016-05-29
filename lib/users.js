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
    }
});

Meteor.users.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
