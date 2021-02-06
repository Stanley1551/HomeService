const jsonfile = require('jsonfile');
const Logger = require('../../Log/Logger');
const configFileName = 'configuration.json';

module.exports = {
    getConfigurations: function(req, res, next){
        //read file
        try
        {
            let json = jsonfile.readFileSync(configFileName);
            res.send(json);

        }catch(e){Logger.logger.error(e); res.status(500).send('Failed to retrieve config file.');}
    },

    getConfigurationName: function(key){
        try{
            let json = jsonfile.readFileSync(configFileName);
            return json[key];
        }catch(e){Logger.logger.error(e); return '';}
    }
}