Tasks = new Mongo.Collection("tasks");

if(Meteor.isServer) {
    Meteor.publish('tasks', function() {
        return Tasks.find({});
    });
}

Meteor.methods({
    'tasks.insert'(newTask) {
        if(!Roles.userIsInRole(this.userId, ['system_admin', 'event_admin'], newTask.eventId)) {
            throw new Meteor.Error('not-authorized');
        }
        Tasks.insert(newTask);
    },
    'tasks.remove'(taskId) {
        let task = Tasks.findOne({_id: taskId});
        if(!Roles.userIsInRole(this.userId, ['event_admin'], task.eventId)) {
            throw new Meteor.Error('not-authorized');
        }
        Tasks.remove({_id: taskId});
        Slots.remove({taskId: taskId});
        Volunteers.remove({'slot.taskId': taskId});
    },
    'tasks.update'(taskId, changedTask) {
        let task = Tasks.findOne({_id: taskId});
        if(Roles.userIsInRole(this.userId, ['task_admin'], taskId) || Roles.userIsInRole(this.userId, ['system_admin', 'event_admin'], task.eventId)) {
            Tasks.update({_id: taskId}, {$set: changedTask});
        } else {
            throw new Meteor.Error('not-authorized');
        }
    },
    'tasks.makeadmin'(uid, taskId) {
        let task = Tasks.findOne({_id: taskId});
        if(Roles.userIsInRole(this.userId, ['system_admin', 'event_admin'], task.eventId) || Roles.userIsInRole(this.userId, 'task_admin', taskId)) {
            Roles.addUsersToRoles(uid, 'task_admin', taskId);
        } else {
            throw new Meteor.Error('not-authorized');
        }
    },  
    'tasks.removeadmin'(uid, taskId) {
        let task = Tasks.findOne({_id: taskId});
        if(Roles.userIsInRole(this.userId, ['system_admin', 'event_admin'], task.eventId) || Roles.userIsInRole(this.userId, 'task_admin', taskId)) {
            Roles.removeUsersFromRoles(uid, 'task_admin', taskId);
        } else {
            throw new Meteor.Error('not-authorized');
        }
    }
});

Tasks.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
