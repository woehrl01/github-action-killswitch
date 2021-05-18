"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/killswitchhub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;


function logOutput(encodedMsg){
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
}

connection.on("ExecuteKill", function (actionId) {
    connection.invoke("AckKill", actionId).catch(function (err) {
        return console.error(err.toString());
    });

    logOutput("kill received, acked");
});


connection.on("ConfirmKill", function (actionId) {
    var encodedMsg = actionId + " killed ";
    logOutput(encodedMsg);
});


connection.start().then(function () {

    var msgBuffer = new Uint32Array(36);
    crypto.getRandomValues(msgBuffer);

    const hashBuffer = crypto.subtle.digest('SHA-256', msgBuffer)
        .then( hashBuffer =>  {

            const hashArray = Array.from(new Uint8Array(hashBuffer));                
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            connection.invoke("RegisterGroup", hashHex).catch(function (err) {
                return console.error(err.toString());
            });

            logOutput("Register: "+ hashHex)
        });

    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var actionId = document.getElementById("actionId").value;
    connection.invoke("SendKill", actionId).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});