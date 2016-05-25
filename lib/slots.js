Slots = new Mongo.Collection("slots");

if(Meteor.isServer) {
    Meteor.publish('slots', function() {
        return Slots.find({});
    });
}

Meteor.methods({
    'slots.insert'(newSlot) {
        if(!Roles.userIsInRole(this.userId, ['task_admin'], newSlot.taskId)) {
            throw new Meteor.Error('not-authorized');
        }
        let task = Tasks.findOne({_id: newSlot.taskId});
        if(task) {
            newSlot.eventId = task.eventId;
            Slots.insert(newSlot);
        } else {
            throw new Meteor.Error('task does not exist');
        }
    },
    'slots.remove'(slotId) {
        let slot = Slots.findOne({_id: slotId});
        if(!slot || !Roles.userIsInRole(this.userId, ['task_admin'], slot.taskId)) {
            throw new Meteor.Error('not-authorized');
        }
    },
    'slots.volunteer'(slotId, toggle) {
        if(!this.userId) {
            throw new Meteor.Error('not logged in');
        }
        let vol = Volunteers.findOne({userId: this.userId, 'slot._id': slotId});
        let slot = Slots.findOne({_id: slotId});
        if((vol && toggle) || (!vol && !toggle)) {
            throw new Meteor.Error('no change');
        }
        if(!vol && slot.curcount >= slot.maxcap) {
            throw new Meteor.Error('maxcap reached');
        }
        if(toggle) {
            Volunteers.insert({userId: this.userId, slot: slot, checkedIn: 0});
            Slots.update({_id: slotId}, {$inc: {curcap: -1, curcount: 1}});
        } else {
            Volunteers.remove({_id: vol._id});
            Slots.update({_id: slotId}, {$inc: {curcap: 1, curcount: -1}});
        }
    }
});

