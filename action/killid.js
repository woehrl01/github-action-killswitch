const core = require('@actions/core');
const crypto = require('crypto');

async function main() {
    var msgBuffer = crypto.randomBytes(36);
    const hashHex = crypto.createHash('sha256').update(msgBuffer).digest('hex');

    console.log(`Use key ${hashHex} for kill`);


    core.saveState("killid", hashHex);
    core.setOutput("killid", hashHex);
}

main();