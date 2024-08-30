# Important
This website spins down when inactive, meaning if the link to this site is clicked during this idle mode, delays can persist for around 50 seconds until site re-enters active mode

# League Stats
Description
This web application allows users to enter their League of Legends username, tag, region, and the number of matches to retrieve stats such as kills, deaths, assists, and damage dealt for each match. The application fetches data using the Riot Games API and displays it in an interface with dark mode support.

# Features
User input for username, tag, region, and number of matches.
Fetches and displays stats for each match, including champion, kills, deaths, assists, and damage dealt.
Supports light and dark mode toggling for user preference.

# Usage
Enter your League of Legends username, tag, region, and number of matches.
Click the Submit button to fetch and display match stats.
Use the Toggle Dark Mode button in the top left corner to switch between light and dark modes.

# Example Account
If you don't have a League account, you can use the following example:
Username: Riot August
Tag: Kitty
Server: Americas

# Limitations
This website is hosted on the free tier of Render, which may result in slower loading times after periods of inactivity.
The Riot Games API has a rate limit of 100 calls every 2 minutes.

# Technologies Used
Frontend: HTML, CSS, JavaScript
Backend: Python (Flask)
API: Riot Games API
Hosting: Render