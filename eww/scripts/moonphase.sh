#!/usr/bin/env bash
LUNATION0=947182440
LUNAR_PERIOD=2551443

moon_phase=$(( ($(date +%s) - $LUNATION0) % $LUNAR_PERIOD * 100 / $LUNAR_PERIOD ))

if [[ "$moon_phase" -eq 0 ]]; then
	icon="" # NEW -----------------⮯
	desc="New Moon"
elif [[ "$moon_phase" -le 4 ]]; then
	icon="" # waxing_cres_1
	desc="Waxing Crescent"
elif [[ "$moon_phase" -le 8 ]]; then
	icon="" # waxing_cres_2
	desc="Waxing Crescent"
elif [[ "$moon_phase" -le 12 ]]; then
	icon="" # waxing_cres_3
	desc="Waxing Crescent"
elif [[ "$moon_phase" -le 16 ]]; then
	icon="" # waxing_cres_4
	desc="Waxing Crescent"
elif [[ "$moon_phase" -le 20 ]]; then
	icon="" #  waxing_cres_5
	desc="Waxing Crescent"
elif [[ "$moon_phase" -le 24 ]]; then
	icon="" # waxing_cres_6
	desc="Waxing Crescent"
elif [[ "$moon_phase" -eq 25 ]]; then
	icon="" # FIRST ---------------⮯
	desc="First Quarter"
elif [[ "$moon_phase" -le 29 ]]; then
	icon="" # waxing_gib_1
	desc="Waxing Gibbous"
elif [[ "$moon_phase" -le 33 ]]; then
	icon="" # waxing_gib_2
	desc="Waxing Gibbous"
elif [[ "$moon_phase" -le 37 ]]; then
	icon="" # waxing_gib_3
	desc="Waxing Gibbous"
elif [[ "$moon_phase" -le 41 ]]; then
	icon="" # waxing_gib_4
	desc="Waxing Gibbous"
elif [[ "$moon_phase" -le 45 ]]; then
	icon="" # waxing_gib_5
	desc="Waxing Gibbous"
elif [[ "$moon_phase" -le 49 ]]; then
	icon="" # waxing_gib_6
	desc="Waxing Gibbous"
elif [[ "$moon_phase" -eq 50 ]]; then
	icon="" # FULL ----------------⮯
	desc="Full Moon"
elif [[ "$moon_phase" -le 54 ]]; then
	icon="" # waning_gib_1
	desc="Waning Gibbous"
elif [[ "$moon_phase" -le 58 ]]; then
	icon="" # waning_gib_2
	desc="Waning Gibbous"
elif [[ "$moon_phase" -le 62 ]]; then
	icon="" # waning_gib_3
	desc="Waning Gibbous"
elif [[ "$moon_phase" -le 66 ]]; then
	icon="" # waning_gib_4
	desc="Waning Gibbous"
elif [[ "$moon_phase" -le 70 ]]; then
	icon="" # waning_gib_5
	desc="Waning Gibbous"
elif [[ "$moon_phase" -le 74 ]]; then
	icon="" # waning_gib_6
	desc="Waning Gibbous"
elif [[ "$moon_phase" -eq 75 ]]; then
	icon="" # THIRD ---------------⮯
	desc="Third Quarter"
elif [[ "$moon_phase" -le 79 ]]; then
	icon="" # waning_cres_1
	desc="Waning Crescent"
elif [[ "$moon_phase" -le 83 ]]; then
	icon="" # waning_cres_2
	desc="Waning Crescent"
elif [[ "$moon_phase" -le 87 ]]; then
	icon="" # waning_cres_3
	desc="Waning Crescent"
elif [[ "$moon_phase" -le 91 ]]; then
	icon="" # waning_cres_4
	desc="Waning Crescent"
elif [[ "$moon_phase" -le 95 ]]; then
	icon="" # waning_cres_5
	desc="Waning Crescent"
elif [[ "$moon_phase" -le 99 ]]; then
	icon="" # waxing_cres_6
	desc="Waning Crescent"
else
	icon="" # NEW
	desc="New Moon"
fi

echo "{\"icon\":\"$icon\",\"desc\":\"$desc\"}"
