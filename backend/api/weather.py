import requests
from flask import Blueprint, request, jsonify
import os

weather_api = Blueprint('weather_api', __name__)

API_KEY = os.getenv('WEATHER_API_KEY')
BASE_URL = "http://api.weatherapi.com/v1/current.json"

# Get current weather for a location
@weather_api.route('/weather', methods=['GET'])
def get_weather():
    location = request.args.get('location')
    if not location:
        return jsonify({'error': 'Location parameter is required'}), 400

    params = {
        'key': API_KEY,
        'q': location
    }
    response = requests.get(BASE_URL, params=params)

    if response.status_code != 200:
        return jsonify({'error': 'Unable to fetch weather data'}), 500

    weather_data = response.json()
    return jsonify({
        'location': weather_data['location']['name'],
        'region': weather_data['location']['region'],
        'country': weather_data['location']['country'],
        'temperature': weather_data['current']['temp_c'],
        'condition': weather_data['current']['condition']['text'],
        'icon': weather_data['current']['condition']['icon']
    })
