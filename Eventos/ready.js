const { Client, ActivityType } = require(`discord.js`);
const mongoose = require("mongoose");
const { mongodb } = require("../../config/config.json");
const DB = require('../../modelos/clientDB');
const Ascii = require("ascii-table");
const ms = require("ms");
require('colors');
const os = require("os");
const osUtils = require("os-utils");

/* ----------[CPU Usage]---------- */
const cpus = os.cpus();
const cpu = cpus[0];

// Accumulate every CPU times values
    const total = Object.values(cpu.times).reduce(
    (acc, tv) => acc + tv, 0
);

// Calculate the CPU usage
const usage = process.cpuUsage();
const currentCPUUsage = (usage.user + usage.system) * 1000;
const perc = currentCPUUsage / total * 100;

/* ----------[RAM Usage]---------- */

/**Get the process memory usage (in MB) */
async function getMemoryUsage() {
return process.memoryUsage().heapUsed / (1024 * 1024).toFixed(2);
}

module.exports = async (client) => {

                // Client Activity
                const initialStatus = setTimeout(() => {
                    client.user.setPresence({
                        activities: [{ name: `Iniciando Bot...`, type: ActivityType.Watching }],
                        status: "idle"
                    });
                });

                const statusArray = [
                    `RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024 ).toFixed(1)}%`,
                    `CPU: ${(perc / 1000 ).toFixed(1)}%`,
                    `a Qin Shi Huang 悟#0001`,
                    `☯𝐎𝐫𝐢𝐞🅽𝐭𝐚𝐥 𝐂🅾𝐦𝐦𝐮𝐧🅸𝐭𝐲☯`,
                    `Timings Java Adaptions`,
                    `Creacion de bots y software`,
                    `>*reportbug para informar cualquier problema`,
                    `Recuerda ver mis comandos con >help`,
                    `Me actualizo a diario con mas de +150 comandos`,
                    `Conectado a mi base de datos`
                ];
                let index = 0;
    
                const randTime = Math.floor(Math.random() * 5) + 1;
    
                setTimeout(() => {
    
                    setInterval(() => {
                        if (index === statusArray.length) index = 0;
                        const status = statusArray[index];
        
                        client.user.setPresence({
                            activities: [{ name: status, type:ActivityType.Watching }],
                            status: "online"
                        });
                        index++;
                    }, 7 * 1000) // Time in ms
    
                }, randTime) // randTime is a random number between 1 and 5 seconds
           
        // Initializing Database Connection 
            if(!mongodb) return;
            mongoose.connect(mongodb, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(() => {
                const table = new Ascii(`📡 STATUS 📡`);                  
                table
                .setHeading(`Client`, `Database`, `Status`)
                .addRow(`📛 Fenix Web`, `📛 MongoDB`, `📛 Connected`);
                console.log(table.toString());
            }).catch((err) => {
                console.log(err)
            });

        //-------------- Systems --------------//
        

        // -------------- Events --------------//

        // Memory Data Update
        let memArray = [];

        setInterval(async () => {

            //Used Memory in GB
            memArray.push(await getMemoryUsage());

            if (memArray.length >= 14) {
                memArray.shift();
            }

            // Store in Database
            await DB.findOneAndUpdate({
                Client: true,
            }, {
                Memory: memArray,
            }, {
                upsert: true,
            });

        }, ms("60s")); //= 30000 (ms)
    };
