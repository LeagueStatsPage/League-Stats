document.addEventListener("DOMContentLoaded", function() {
    // Toggle Dark Mode
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Submit Button Event Listener
    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', () => {
        fetchMatchData();
    });

    function fetchMatchData() {
        const gameName = document.getElementById('gameName').value.trim();
        const tagLine = document.getElementById('tagLine').value.trim();
        const numMatches = document.getElementById('numMatches').value.trim();
        const region = document.getElementById('Region').value.trim();
        const responseElement = document.getElementById('response');

        // Input Validation
        if (!gameName || !tagLine || !numMatches || !region) {
            responseElement.textContent = 'Please fill in all fields.';
            return;
        }

        if (numMatches < 1 || numMatches > 100) {
            responseElement.textContent = 'Number of matches must be between 1 and 100.';
            return;
        }

        responseElement.textContent = 'Fetching data...';

        const requestData = {
            region: region,
            username: gameName,
            tagline: tagLine,
            num: parseInt(numMatches)
        };

        fetch('/submit-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                displayStats(data.game);
                displayMatchData(data.game);
                responseElement.textContent = '';
            } else {
                responseElement.textContent = data.message || 'An error occurred while fetching data.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            responseElement.textContent = 'Failed to fetch data. Please try again later.';
        });
    }

    function displayStats(gameData) {
        const totalKillsElement = document.getElementById('totalKills');
        const totalDeathsElement = document.getElementById('totalDeaths');
        const totalDamageElement = document.getElementById('totalDamage');

        const totals = gameData[gameData.length - 1];

        totalKillsElement.textContent = totals['total kills'];
        totalDeathsElement.textContent = totals['total deaths'];
        totalDamageElement.textContent = totals['total damage'];
    }

    function displayMatchData(gameData) {
        const matchDataContainer = document.getElementById('matchData');
        matchDataContainer.innerHTML = '';

        // Exclude the last element which contains total stats
        const matches = gameData.slice(0, -1);

        matches.forEach(match => {
            const matchElement = document.createElement('div');
            matchElement.classList.add('match');

            const champImage = document.createElement('img');
            champImage.src = `data:image/png;base64,${match['champ image']['image base64']}`;
            champImage.alt = match['champ image']['champion'];

            const matchDetails = document.createElement('div');
            matchDetails.classList.add('match-details');

            const championName = document.createElement('p');
            championName.innerHTML = `<strong>Champion:</strong> ${match['champ image']['champion']}`;

            const kills = document.createElement('p');
            kills.innerHTML = `<strong>Kills:</strong> ${match.kills}`;

            const deaths = document.createElement('p');
            deaths.innerHTML = `<strong>Deaths:</strong> ${match.deaths}`;

            const assists = document.createElement('p');
            assists.innerHTML = `<strong>Assists:</strong> ${match.assists}`;

            const damage = document.createElement('p');
            damage.innerHTML = `<strong>Damage:</strong> ${match.damage}`;

            matchDetails.appendChild(championName);
            matchDetails.appendChild(kills);
            matchDetails.appendChild(deaths);
            matchDetails.appendChild(assists);
            matchDetails.appendChild(damage);

            matchElement.appendChild(champImage);
            matchElement.appendChild(matchDetails);

            matchDataContainer.appendChild(matchElement);
        });
    }
});
