FlowRouter.route('/', {
    name: 'root',
    action() {
        //BlazeLayout.render('App_body', {main: 'Events_list'});
        FlowRouter.go('events.list');
    }
});

FlowRouter.route('/events', {
    name: 'events.list',
    action() {
        BlazeLayout.render('App_body', {main: 'Events_list'});
    }
});

FlowRouter.route('/events/:_id', {
    name: 'events.detail',
    action() {
        BlazeLayout.render('App_body', {main: 'Events_detail'});
    }
});
