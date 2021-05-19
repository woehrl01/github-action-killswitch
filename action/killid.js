const core = require('@actions/core');
const crypto = require('crypto');

function generateUnqiqueKillId(){
    var cryptoRandom = crypto.randomBytes(100);
    return crypto.createHash('sha256')
                .update(cryptoRandom)
                .digest('base64');
}

async function main() {
    const killId = generateUnqiqueKillId();
    console.log(`Use key ${killId} for kill`);
    core.saveState("killid", killId);
    core.setOutput("killid", killId);
}

main();