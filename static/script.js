document.addEventListener("DOMContentLoaded", function() {
    // Function to send data to the backend
    function sendData() {
        var dataToSend = {
            region: document.getElementById("Region").value || "default",
            username: document.getElementById("gameName").value || "default",
            tagline: document.getElementById("tagLine").value || "default"
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

            data = data["api_data"];
        
            console.log(data.gameName);
            console.log(data.tagLine);  
            console.log(data.puuid);

            const usernameElement = document.getElementById("displayUsername");
            const puuidElement = document.getElementById("displayPUUID");

            if (usernameElement) usernameElement.textContent = `Username: ${data["gameName"]}#${data["tagLine"]}`;
            if (puuidElement) puuidElement.textContent = `PUUID: ${data["puuid"]}`;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    document.getElementById('submitButton').addEventListener('click', function() {
        sendData();  // Call the function to handle data submission
    });
});
