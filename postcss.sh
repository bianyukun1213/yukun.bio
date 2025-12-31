#! /bin/bash

npx postcss ./style.src.css -o ./res/style.css -w --experimental-require-module
