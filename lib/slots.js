Slots = new Mongo.Collection("slots");

if(Meteor.isServer) {
    Meteor.publish('slots', function() {
        return Slots.find({});
    });
}

Meteor.methods({
    'slots.insert'(newSlot) {
        if(!Roles.userIsInRole(this.userId, ['system_admin', 'event_admin'], newSlot.eventId) && !Roles.userIsInRole(this.userId, ['task_admin'], newSlot.taskId)) {
            throw new Meteor.Error('not-authorized');
        }
        let task = Tasks.findOne({_id: newSlot.taskId});
        if(task) {
            newSlot.curcount = 0;
            newSlot.curcap = newSlot.mincap;
            newSlot.eventId = task.eventId;
            console.log("inserting", newSlot);
            Slots.insert(newSlot);
        } else {
            throw new Meteor.Error('task does not exist');
        }
    },
    'slots.update'(slotId, changedSlot) {
        if(!Roles.userIsInRole(this.userId, ['system_admin', 'event_admin'], changedSlot.eventId) && !Roles.userIsInRole(this.userId, ['task_admin'], changedSlot.taskId)) {
            throw new Meteor.Error('not-authorized');
        }
        let task = Tasks.findOne({_id: changedSlot.taskId});
        // FIXME macht wenig Sinn so
        if(task) {
            let slot = Slots.findOne({_id: slotId});
            changedSlot.eventId = task.eventId;
            changedSlot.curcap = changedSlot.mincap - slot.curcount;
            Slots.update({_id: slotId}, {$set: changedSlot});
        } else {
            throw new Meteor.Error('task does not exist');
        }
    },
    'slots.remove'(slotId) {
        let slot = Slots.findOne({_id: slotId});
        if(!Roles.userIsInRole(this.userId, ['system_admin', 'event_admin'], slot.eventId) && !Roles.userIsInRole(this.userId, ['task_admin'], slot.taskId)) {
            throw new Meteor.Error('not-authorized');
        }
        Slots.remove({_id: slotId});
        Volunteers.remove({'slot._id': slotId});
    },
    'slots.volunteer'(uid, slotId, toggle, temp) {
        if(!this.userId) {
            throw new Meteor.Error('not logged in');
        }
        let slot = Slots.findOne({_id: slotId});
        if(this.userId == uid || Roles.userIsInRole(this.userId, ['system_admin', 'coordinator'], slot.eventId)) {
            let vol = Volunteers.findOne({userId: uid, 'slot._id': slotId});
            if((vol && toggle) || (!vol && !toggle)) {
                throw new Meteor.Error('no change');
            }
            if(!vol && slot.curcount >= slot.maxcap) {
                throw new Meteor.Error('maxcap reached');
            }
            if(toggle) {
                Volunteers.insert({userId: uid, slot: slot, checkedIn: false, temp: temp});
                if(!temp) {
                    Slots.update({_id: slotId}, {$inc: {curcap: -1, curcount: 1}});
                }
            } else {
                Volunteers.remove({_id: vol._id});
                if(!temp) {
                    Slots.update({_id: slotId}, {$inc: {curcap: 1, curcount: -1}});
                }
            }
        } else {
            throw new Meteor.Error('not authorized');
        }
    }
});

Slots.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
