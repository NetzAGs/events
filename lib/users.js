if(Meteor.isServer) {
    Meteor.publish('users', function() {
        if(Roles.userIsInRole(this.userId, ['system_admin', 'event_admin', 'task_admin'])) {
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
