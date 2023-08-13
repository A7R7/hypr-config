#!/usr/bin/env bash
read -ra location <<<"$(<"$HOME/.local/.location")"
LAT="${location[0]}"
LON="${location[1]}"
API=$(<"$HOME/.local/.owm_api_key")
UNITS="metric"
WEATHER_URL="https://api.openweathermap.org/data/2.5/weather?lat=$LAT&lon=$LON&units=$UNITS&exclude=minutely&appid=$API&dt=1"
AIR_URL="http://api.openweathermap.org/data/2.5/air_pollution?lat=$LAT&lon=$LON&appid=$API"

LUNATION0=947182440
LUNAR_PERIOD=2551443

while true; do
	WEATHER_JSON=$(curl -s "$WEATHER_URL")
	AIR_JSON=$(curl -s "$AIR_URL")
	# if [[ $DEBUG==1 ]]; then
	# 	echo $WEATHER_JSON
	# 	echo $AIR_JSON
	# fi
	id=$(jq -r ".weather[0].id" <<<$WEATHER_JSON)
	desc=$(jq -r ".weather[0].description" <<<$WEATHER_JSON)
	sunrise=$(jq -r ".sys.sunrise" <<<$WEATHER_JSON)
	sunset=$(jq -r ".sys.sunset" <<<$WEATHER_JSON)
	now=$(date "+%s")
	if [[ "$now" -gt "$sunset" || "$now" -lt "$sunrise" ]]; then
		night="true"
	else
		night="false"
	fi
	sunrise_h=$(date -d @"$sunrise" +"%H")
	sunrise_m=$(date -d @"$sunrise" +"%M")
	sunset_h=$(date -d @"$sunset" +"%H")
	sunset_m=$(date -d @"$sunset" +"%M")
	# moon_phase=$((($(date +%s) - $LUNATION0) % $LUNAR_PERIOD * 100 / $LUNAR_PERIOD))
	temp=$(jq -r ".main.temp" <<<$WEATHER_JSON)
	temp_min=$(jq -r ".main.temp_min" <<<$WEATHER_JSON)
	temp_max=$(jq -r ".main.temp_max" <<<$WEATHER_JSON)
	feels_like=$(jq -r ".main.feels_like" <<<$WEATHER_JSON)
	clouds=$(jq -r ".clouds.all" <<<$WEATHER_JSON)
	wind_speed=$(jq -r ".wind.speed" <<<$WEATHER_JSON)
	knots=$(echo "$wind_speed * 1.943844" | bc | awk '{print int($1+0.5)}')
	aqi=$(jq -r ".list[0].main.aqi" <<<$AIR_JSON)

	if [[ "$night" == "false" ]]; then
		if [[ "$id" -lt 300 ]]; then
			icon=" "
		elif [[ "$id" -lt 500 ]]; then
			icon=" "
		elif [[ "$id" -eq 504 ]]; then
			icon=" "
		elif [[ "$id" -lt 600 ]]; then
			icon=" "
		elif [[ "$id" -lt 700 ]]; then
			icon=" "
		elif [[ "$id" -eq 711 ]]; then
			icon=" "
		elif [[ "$id" -eq 781 ]]; then
			icon=" "
		elif [[ "$id" -lt 800 ]]; then
			icon=" "
		elif [[ "$id" -eq 800 ]]; then
			icon=" "
		elif [[ "$id" -lt 803 ]]; then
			icon=" "
		else
			icon=" "
		fi
	else
		if [[ "$id" -lt 300 ]]; then
			icon=" "
		elif [[ "$id" -lt 500 ]]; then
			icon=" "
		elif [[ "$id" -eq 504 ]]; then
			icon=" "
		elif [[ "$id" -lt 600 ]]; then
			icon=" "
		elif [[ "$id" -lt 700 ]]; then
			icon=" "
		elif [[ "$id" -eq 711 ]]; then
			icon=" "
		elif [[ "$id" -eq 781 ]]; then
			icon=" "
		elif [[ "$id" -lt 800 ]]; then
			icon=" "
		elif [[ "$id" -eq 800 ]]; then
			icon=" "
		elif [[ "$id" -lt 803 ]]; then
			icon=" "
		else
			icon=" "
		fi
	fi

	if [[ knots -lt 1 ]]; then
		bf_icon=" "
		bf_desc="calm"
	elif [[ knots -lt 4 ]]; then
		bf_icon=" "
		bf_desc="light air"
	elif [[ knots -lt 7 ]]; then
		bf_icon=" "
		bf_desc="light breeze"
	elif [[ knots -lt 11 ]]; then
		bf_icon=" "
		bf_desc="gentle breeze"
	elif [[ knots -lt 17 ]]; then
		bf_icon=" "
		bf_desc="moderate breeze"
	elif [[ knots -lt 22 ]]; then
		bf_icon=" "
		bf_desc="fresh breeze"
	elif [[ knots -lt 28 ]]; then
		bf_icon=" "
		bf_desc="strong breeze"
	elif [[ knots -lt 34 ]]; then
		bf_icon=" "
		bf_desc="near gale"
	elif [[ knots -lt 41 ]]; then
		bf_icon=" "
		bf_desc="gale"
	elif [[ knots -lt 48 ]]; then
		bf_icon=" "
		bf_desc="strong gale"
	elif [[ knots -lt 56 ]]; then
		bf_icon=" "
		bf_desc="storm"
	elif [[ knots -lt 64 ]]; then
		bf_icon=" "
		bf_desc="violent storm"
	else
		bf_icon=" "
		bf_desc="hurricane"
	fi

	# if [[ $uvi ]]; then
	# 	if [[ $uvi -le 2 ]]; then
	# 		uvi_desc="low"
	# 	elif [[ $uvi -le 5 ]]; then
	# 		uvi_desc="moderate"
	# 	elif [[ $uvi -le 7 ]]; then
	# 		uvi_desc="high"
	# 	elif [[ $uvi -le 10 ]]; then
	# 		uvi_desc="intense"
	# 	else
	# 		uvi_desc="extreme"
	# 	fi
	# fi

	case $aqi in
	1) aqi_desc="good" ;;
	2) aqi_desc="moderate" ;;
	3) aqi_desc="poor" ;;
	4) aqi_desc="intense" ;;
	5) aqi_desc="extreme" ;;
	esac
	echo "{\
\"id\":\"$id\",\
\"icon\":\"$icon\",\
\"desc\":\"$desc\",\
\"bf_icon\":\"$bf_icon\",\
\"bf_desc\":\"$bf_desc\",\
\"wind_speed\":\"$wind_speed\",\
\"sunrise\":{\"h\":\"$sunrise_h\", \"m\":\"$sunrise_m\"},\
\"sunset\":{\"h\":\"$sunset_h\", \"m\":\"$sunset_m\"},\
\"night\":\"$night\",\
\"temp\":\"$temp\",\
\"temp_max\":\"$temp_max\",\
\"temp_min\":\"$temp_min\",\
\"feels_like\":\"$feels_like\",\
\"aqi\":\"$aqi\",\
\"aqi_desc\":\"$aqi_desc\",\
\"clouds\":\"$clouds\"\
}"

	# \"moon\":\"$moon\",\
	# \"moon_desc\":\"$moon_desc\",\
	# \"uvi\":\"$uvi\",\
	# \"uvi_desc\":\"$uvi_desc\",\
	# \"rain_1h\":\"$rain_1h\",\
	# \"rain_day\":\"$rain_day\",\
	sleep 720
done
