const configHandler = require('./ConfigurationHandler');
const https = require('https');
const Logger = require('../../Log/Logger');

module.exports = {
    sendNotification(req, res, next){
        let title = req.body.title;
        let body = req.body.body;
        let token = configHandler.getConfigurationName('FCMToken');
        try
        {
            if(token){
                const data = JSON.stringify({
                "notification": {
                        "body": body,
                        "title": title }
                      ,
                      "priority": "high",
                      "data": {
                        "click_action": "FLUTTER_NOTIFICATION_CLICK",
                        "id": "1",
                        "status": "done" }
                      ,
                      "to": "/topics/changes"
               
                });
                const options = {
                    hostname: 'fcm.googleapis.com',
                    path: '/fcm/send',
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': ('key='+token)
                    }
                  }
                  
                  const req = https.request(options, res => {
                    Logger.logger.info(`statusCode: ${res.statusCode}`);
                    
                  });
                  
                  req.on('error', error => {
                    Logger.logger.error(error);
                  });
                  
                  req.write(data);
                  req.end();
                }
        }
        catch(e){
            Logger.logger.error(e);
        }
        finally {res.status(200).send('Ok')}
    }
}