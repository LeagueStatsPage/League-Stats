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
            const matchDataElement = document.getElementById("matchData");
            matchDataElement.innerHTML = ""; // Clear previous data

            data["game"].forEach(game => {
                // Create a new div for each match
                const matchDiv = document.createElement("div");
                matchDiv.className = "match";

                // Champion Icon
                const champImage = document.createElement("img");
                champImage.src = `data:image/png;base64,${game["champ image"]["image base64"]}`;
                matchDiv.appendChild(champImage);

                // Kills, Deaths, Assists
                const stats = document.createElement("p");
                stats.textContent = `Kills: ${game["kills"]}, Deaths: ${game["deaths"]}, Assists: ${game["assists"]}`;
                matchDiv.appendChild(stats);

                // Append match data to the matchDataElement
                matchDataElement.appendChild(matchDiv);
            });

            const responseElement = document.getElementById("response");
            responseElement.textContent = `Username: ${data["gameName"]}#${data["tagLine"]}`;
        })
        .catch((error) => {
            document.getElementById("response").textContent = "Could not find account";
        });
    }

    document.getElementById('submitButton').addEventListener('click', function() {
        sendData();
    });
});
