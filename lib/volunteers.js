Volunteers = new Mongo.Collection("volunteers");

if(Meteor.isServer) {
    Meteor.publish('volunteers', function() {
        if(Roles.userIsInRole(this.userId, ['system_admin'])) {
            return Volunteers.find({});
        }
        // find all volunteers where this user is the volunteer, event_admin, task_admin or coordinator:
        let userEvents = Roles.getGroupsForUser(this.userId, ['event_admin', 'coordinator']);
        let userTasks = Roles.getGroupsForUser(this.userId, ['task_admin']);
        return Volunteers.find({
            $or: [{
                userId: this.userId
            }, {
                'slot.eventId': {$in: userEvents}
            }, {
                'slot.taskId': {$in: userTasks}
            }]
        });
    });
}
