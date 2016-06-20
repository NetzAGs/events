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
