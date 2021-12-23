#!/bin/bash

DIR=`dirname $0`
ROOT=$DIR/..

# Format code in project.

find \
    $ROOT/index.js \
    $ROOT/package.json \
    $ROOT/test-app \
    -not \( -path $ROOT/node_modules -prune \) \
    -not \( -path $ROOT/test-app/node_modules -prune \) \
    -name '*.js' -print0 \
    -or -name '*.ts' -print0 \
    -or -name '*.css' -print0 \
    -or -name '*.scss' -print0 \
    -or -name '*.html' -print0 \
    -or -name '*.json' -print0 \
    | xargs -0 $ROOT/node_modules/.bin/prettier \
        --config $ROOT/.prettierrc.js \
        --write
