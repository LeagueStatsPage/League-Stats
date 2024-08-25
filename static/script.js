document.addEventListener("DOMContentLoaded", function() {
    // Function to send data to the backend
    function sendData() {

        var numMatches = document.getElementById("numMatches").value;

        if (numMatches > 100 || numMatches < 1){
            document.getElementById("response").textContent = "Invalid number of matches";
            throw new Error("Given input is not within range");
        }

        if (document.getElementById("Region").value == "Select a Region"){
            document.getElementById("response").textContent = "Please choose a region";
            throw new Error("No region chosen");
        }

        var dataToSend = {
            region: document.getElementById("Region").value || "default",
            username: document.getElementById("gameName").value || "default",
            tagline: document.getElementById("tagLine").value || "default",
            num: numMatches
        };


        fetch('/submit-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)  // Send data as JSON
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            const usernameElement = document.getElementById("response");

            if (usernameElement) 
                var accountData = "Success<br> " + `Username: ${data["api_data"]["gameName"]}#${data["api_data"]["tagLine"]}`; 
                var gameData = `Total Kills: ${data["game"][numMatches]["total kills"]} \n Total Deaths: ${data["game"][numMatches]["total deaths"]} \n Total Damage dealt to champions: ${data["game"][numMatches]["total damage"]}`;

                usernameElement.innerHTML = accountData + "<br>" + gameData;
        })
        .catch((error) => {
            document.getElementById("response").textContent = "Could not find account";
        });
    }

    document.getElementById('submitButton').addEventListener('click', function() {
        sendData();
    });
});
