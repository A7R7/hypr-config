#!/usr/bin/env bash

cp $(geticons $1 | head -n 1) ~/.config/eww/.icons/$1
