# events

[meteor](https://www.meteor.com/) based events volunteer management platform.

## Development

See http://guide.meteor.com/

## Deployment

You can choose from [different deployment methods](http://guide.meteor.com/deployment.html), the recommended is [mupx](https://github.com/arunoda/meteor-up/tree/mupx):

    npm install -g mupx
    mkdir events-prod && cd events-prod
    mupx init

Example mup.json:

   
    {
      // Server authentication info
      "servers": [
    	{
    	  "host": "production.meteor.example.com",
    	  "username": "root",
    	  "pem": "~/.ssh/id_rsa",
    	  "env": {
    		  "HTTP_FORWARDED_COUNT": 1, // nginx proxy
    		  "MAIL_URL": "smtp://mail.example.com:25/"
    	  }
    	}
      ],
      "setupMongo": true,
      "appName": "events",
      "app": "/project/path/events",
      "env": {
    	"PORT": 443,
    	"ROOT_URL": "https://events.example.com"
      },
      "deployCheckWaitTime": 300, // the default value didn't work for me
      "enableUploadProgressBar": true
    } 

Backup database:

    ssh root@production.meteor.example.com docker exec mongodb mongodump --archive --db events > backup_events_`date "+%Y%m%d-%H%M"`.dump

Make user a system admin (first argument can be `{}` instead of `{_id: ...}` if there's only one user in the db, otherwise you have to provide a user id):

    ssh root@production.meteor.example.com docker exec -it mongodb mongo events
    db.users.update({_id:"GQ4fy3aRrBQfFqD6h"}, {$set: {roles: {__global_roles__: ["system_admin"]}}});

This user can then use the web GUI to set other system or event admins and create events. S.b. for details on access roles used in this project.

## Roles
This project uses the meteor package [alanning:roles](https://atmospherejs.com/alanning/roles). Check out its documentation and examples first!

### System admins

**role:** `__global_roles__: ["system_admin"]`

* add and remove system admins
* create and remove events
* add and remove event admins
* most operations from the other roles (forgot to document it)

### Event admins

**role:** `event_id: ["event_admin"]`

* add and remove event admins
* manage the event, i.e. change properties
* send emails to all volunteers of this event
* create and remove event tasks
* add and remove task admins
* add and remove event coordinators

*Users added as event admins in the web UI automatically become event coordinators as well*

### Task admins

**role:** `task_id: ["task_admin"]`

* add and remove task admins
* manage the task, i.e. change properties
* send emails to all volunteers of this task
* create, remove and modify time slots
* manage volunteers for this task, i.e. list and check in the volunteers

*Users added as task admins in the web UI automatically become event coordinators as well*

### Event coordinators

**role:** `event_id: ["coordinator"]`

* add and list volunteers
