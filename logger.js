const EventEmitter = require('events');

class Logger extends EventEmitter {
    info(message) {
        console.log(`INFO: ${message}`);
    }
}

module.exports = Logger;
