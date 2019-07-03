#!/bin/bash

currentFolder=$(pwd)

cd $currentFolder/src/functions

errorCode=0
for d in *; do
    if [[ -d $d ]]; then
        cd "$d"
        # build dependencies
        npm install
        cd ..
    fi
done

cd $currentFolder
exit $errorCode