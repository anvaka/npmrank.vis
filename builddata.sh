#/bin/bash

# This script will clone the gist with daily updated data and transform it into
# JSON format. It is not the most efficient way to have incremental updates, since
# script visits every single git log entry (instead of just adding what's changed)

GIST_FOLDER="8e8fa57c7ee1350e3491"
if [ -d "$GIST_FOLDER" ]; then
  cd $GIST_FOLDER
  git fetch --all
  git reset --hard origin/master
else
  git clone git@gist.github.com:8e8fa57c7ee1350e3491.git
  cd $GIST_FOLDER
fi

# we will iterate over each revision and transform markdown into json format
content=()

for revision in $(git rev-list master)
do
  git checkout $revision
  content+=($(node ../build-data/collect.js))
done

# join JSON records with "," seperator
outContent=$(printf ",%s" "${content[@]}")
outContent=${outContent:1}

# and dump them into the CommonJS module
outfile="../data/points.js"
echo "module.exports = [" > $outfile
echo $outContent >> $outfile
echo "];" >> $outfile

cd ../

# Finally compress the data into web-friendly format
node build-data/compact.js > "data/compacted.js"
