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

Meteor.methods({
    'volunteers.checkin'(volId, toggle) {
        let vol = Volunteers.findOne({_id: volId});
        let task = Tasks.findOne({_id: vol.slot.taskId});
        perm = (Roles.userIsInRole(this.userId, ['task_admin'], task._id) || Roles.userIsInRole(this.userId, ['system_admin', 'event_admin'], task.eventId));
        if(perm) {
            Volunteers.update({_id: volId}, {$set: {checkedIn: toggle}});
        } else {
            throw new Meteor.Error('not-authorized');
        }
    }
});

Volunteers.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
