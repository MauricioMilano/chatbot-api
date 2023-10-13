const logger = require('node-color-log');

module.exports ={
    info(message){
        logger.color("green").log(`[${process.pid}] ${message}`)
    }, 
    warn(message){
        logger.color("yellow").log(`[${process.pid}] [WARN] ${message}`)
    },
    error(message){
        logger.color("red").log(`[${process.pid}] [ERROR] ${message}`)
    }

}