const core = require('@actions/core');
const signalR = require('@microsoft/signalr');

async function main() {

    try {
        const timeout = core.getInput('timeout') || 60;
        console.log(`Wait for ${timeout} seconds!`);

        const baseurl = core.getInput('baseurl') || 'http://localhost:5000';

        let connection = new signalR.HubConnectionBuilder()
            .withUrl(baseurl + '/killswitchhub')
            .withAutomaticReconnect()
            .build();

        await connection.start();
        await connection.invoke("RegisterGroup", "abc");

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