const os = require("os")
const cluster = require("cluster")

const runPrimaryProcess = () =>{
    const processesCount = os.cpus().length * 2
    console.log(`Primary ${process.pid} is running`)
    console.log(`Forking Server with ${processesCount}`)

    for (let index = 0; index < processesCount; index++){
        cluster.fork()
        cluster.on('exit', (worker,code, signal)=>{
            if(code!==0 && !worker.exitedAfterDisconnect){
                console.log(`Worker ${worker.process.pid} died with ${signal}... Scheduling another one`)
                cluster.fork()
            }
        })
    }
}

const runWorkerProcess = async () => {
    await require('./server.js')
}

cluster.isPrimary? runPrimaryProcess(): runWorkerProcess()