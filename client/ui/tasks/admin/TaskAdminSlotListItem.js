import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Task_admin_slot_list_item.events({
    'submit form.modify-slot'(event) {
        event.preventDefault();
        const taskId = FlowRouter.getParam('_id');
        let changedSlot = {
            taskId: taskId,
            title: {
                en: event.target.slotTitleEn.value,
                de: event.target.slotTitleDe.value
            },
            startTime: moment(event.target.slotStartTime.value).toDate(),
            endTime: moment(event.target.slotEndTime.value).toDate(),
            allday: $(event.target.slotAllday).is(':checked'),
            mincap: parseInt(event.target.slotMincap.value),
            maxcap: parseInt(event.target.slotMincap.value) + parseInt(event.target.slotBuffer.value),
        };
        //let slot = Slots.find({_id: this._id});
        //changedSlot.curcap -= (slot.mincap - changedSlot.mincap);
        Meteor.call('slots.update', this._id, changedSlot);
    },
    'click .slot-remove'(event) {
        let thisSlot = this;
        bootbox.confirm("Really remove " + this.title.en + "?", function(resp) {
            if(resp) {
                Meteor.call('slots.remove', thisSlot._id);
            }
        });
    }
});
