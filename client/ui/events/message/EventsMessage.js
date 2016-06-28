import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Events_message.helpers({
    event() {
        const eventId = FlowRouter.getParam('_id');
        try {
            return Events.findOne({_id: eventId.eventId});
        }
        catch(e) {
            return "";
        }
    },  
    eventPath() {
        const eventId = FlowRouter.getParam('_id');
        try {
            return FlowRouter.path('events.detail', {_id: eventId});
        }
        catch(e) {
            return "";
        }
    }
});

Template.Events_message.events({
    'change [type=checkbox]'(event) {
        let toggle = $(event.target).is(":checked");
        if($(event.target).hasClass("event-msg-all")) {
            $(".recipients-list :checkbox").prop("checked", toggle);
        } else if(!toggle) {
            $(".recipients-list .event-msg-all").prop("checked", false);
        }
    },
    'submit form.sendEventMessage'(event) {
        event.preventDefault();
        const eventId = FlowRouter.getParam('_id');
        let msg = {
            subject: {
                de: event.target.eventMsgTitleDe.value,
                en: event.target.eventMsgTitleEn.value
            },
            body: {
                de: event.target.eventMsgDe.value,
                en: event.target.eventMsgEn.value
            },
            sendToCoordinators: $(event.target).find(".event-msg-coordinators").is(":checked"),
            sendToChecked: $(event.target).find(".event-msg-checked").is(":checked"),
            sendToUnchecked: $(event.target).find(".event-msg-unchecked").is(":checked"),
        };
        Meteor.call('messages.sendEventMessage', eventId, msg, function(err, res) {
            if(err) {
                bootbox.alert("Error sending Mail: " + err.error);
            } else {
                bootbox.alert("Mail sent!", function() {
                    FlowRouter.go("events.detail", {_id: eventId});
                });
            }
        });
    }
});
