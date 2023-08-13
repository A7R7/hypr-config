#!/usr/bin/env bash
AMAP_API_KEY=$(<"$HOME/.local/.amap_api_key")
LOCAL_IP=$(curl -s --noproxy '*' ifconfig.me)
ADCODE=$(curl -s --noproxy '*' 'https://restapi.amap.com/v3/ip?ip='$LOCAL_IP'&output=xml&key='$AMAP_API_KEY | grep -oP '(?<=<adcode>)[^<]+' | sed -n '1p')
WEATHER_URL='https://restapi.amap.com/v3/weather/weatherInfo?city='$ADCODE'&key='$AMAP_API_KEY'&extensions=all'
while true; do
	WEATHER_JSON_ALL=$(curl -s --noproxy '*' $WEATHER_URL)
	WEATHER_JSON=$(jq -r ".lives[0]" <<<$WEATHER_JSON_ALL)
	echo $WEATHER_JSON
	sleep 5
done
