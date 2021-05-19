const core = require('@actions/core');
const signalR = require('@microsoft/signalr');

async function establishConnection(baseUrl, killId){
    let connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/killswitchhub`)
        .withAutomaticReconnect()
        .build();

    await connection.start();
    await connection.invoke("RegisterGroup", killId);

    return connection;
}

async function throwOnKillReceive(connection){
    console.log(`Wait for ${timeout} seconds, to receive kill command.`);

    return await new Promise((resolve, reject) => {
        connection.on("ExecuteKill", _ => {
            console.log(`Kill received`);
            reject();
        });

        setTimeout(() => {
            console.log(`No kill received in timewindow`);
            resolve()
        }, 1000 * timeout); 
    });
}

async function main() {
    try {
        const timeout = core.getInput('timeout') || 60;
        const baseUrl = core.getInput('baseurl') || 'http://localhost:5000';
        const killId = core.getState("killid");

        let connection = await establishConnection(baseUrl, killId);
        await throwOnKillReceive(connection, timeout);
    } catch (error) {
        core.setFailed(error.message);
    }
}

main();