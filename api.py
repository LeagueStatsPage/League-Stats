from dotenv import load_dotenv
import os
import requests
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

load_dotenv() 
api_key = os.getenv('API_KEY')

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('mastery.html')

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


        return jsonify({"status": "success", "api_data": account_data})
    else:
        return jsonify({"status": "error", "message": "Failed to retrieve data from the API"}), account_response.status_code

if __name__ == '__main__':
    app.run(debug=True)

