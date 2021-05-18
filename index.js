const core = require('@actions/core');
const signalR = require('@microsoft/signalr');
const crypto = require('crypto');

async function main() {

    try {
        const timeout = core.getInput('timeout') || 60;
        console.log(`Wait for ${timeout} seconds!`);

        const baseurl = core.getInput('baseurl') || 'http://localhost:5000';

        let connection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseurl}/killswitchhub`)
            .withAutomaticReconnect()
            .build();


        var msgBuffer = crypto.randomBytes(36);
        const hashHex = crypto.createHash('sha256').update(msgBuffer).digest('hex');

        console.log(`Use key ${hashHex} for kill`);


        await connection.start();
        await connection.invoke("RegisterGroup", hashHex);

        core.setOutput("killid", hashHex);

        await new Promise(
            function(resolve, reject) {
                connection.on("ExecuteKill", data => {
                    console.log(`Kill received`);
                    reject("killed");
                });

                setTimeout(
                    function() {
                        resolve()
                    }, 1000 * timeout); 
            });

        console.log(`No kill received in timewindow`);

    } catch (error) {
        core.setFailed(error.message);
    }
}

main();