from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv
import os
import requests
from flask import Flask, request, jsonify, render_template
from io import BytesIO
import base64

load_dotenv() 
api_key = os.getenv('API_KEY')

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('mastery.html')

def fetch_match_data(match_id, api_key, region):
    match_detail_url = f"https://{region}.api.riotgames.com/lol/match/v5/matches/{match_id}?api_key={api_key}"
    response = requests.get(match_detail_url)
    return response.json()

@app.route('/submit-data', methods=['POST'])
def submit_data():
    data = request.json 

    gameName = data["username"].replace(" ", "%20")
    tagLine = data["tagline"]
    region = data["region"].lower()
    numMatches = data["num"]

    api_url = f"https://{region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}?api_key={api_key}"

    account_response = requests.get(api_url)
    if account_response.status_code == 200: #If the account is fetched
        account_data = account_response.json()
        puuid = account_data["puuid"]

        match_id_url = f"https://{region}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count={numMatches}&api_key={api_key}"
        match_id_response = requests.get(match_id_url)
        match_id_data = match_id_response.json()

        games = []
        totalK = 0
        totalD = 0
        totalDMG = 0

        dict = {}

        with ThreadPoolExecutor(max_workers=10) as executor:

            for match_id in match_id_data:
                future = executor.submit(fetch_match_data, match_id, api_key, region)
                dict[future] = match_id



            for match_id in match_id_data:
                future = next(f for f, m_id in dict.items() if m_id == match_id)
                individual_match_data = future.result()

                inGameOrder = individual_match_data["metadata"]["participants"].index(f"{puuid}")
                player = individual_match_data["info"]["participants"][inGameOrder]

                kills = player["kills"]
                deaths = player["deaths"]
                assists = player["assists"]
                damage = player["totalDamageDealtToChampions"]

                totalK += kills
                totalD += deaths
                totalDMG += damage

                champion = player["championName"]
                image_response = requests.get(f"https://ddragon.leagueoflegends.com/cdn/14.16.1/img/champion/{champion}.png")
                image = BytesIO(image_response.content)
                img_base64 = base64.b64encode(image.getvalue()).decode('utf-8')

                game_data = {
                    "kills": kills,
                    "deaths": deaths,
                    "assists": assists,
                    "damage": damage,
                    "champ image": {
                        "champion": champion,
                        "image base64": img_base64
                    }
                }
        
                games.append(game_data)


        total_numbers = {
            "total kills": totalK,
            "total deaths": totalD,
            "total damage": totalDMG
        }

        games.append(total_numbers)

        return jsonify({"status": "success", "api_data": account_data, "game": games})
    else:
        return jsonify({"status": "error", "message": "Failed to retrieve data from the API"}), account_response.status_code

if __name__ == '__main__':
    app.run(debug=True)

