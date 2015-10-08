#/bin/bash

#git clone git@gist.github.com:8e8fa57c7ee1350e3491.git

cd 8e8fa57c7ee1350e3491
outfile="../data/points.js"
content=()

for revision in $(git rev-list master)
do
  git checkout $revision
  content+=($(node ../collect.js))
done

outContent=$(printf ",%s" "${content[@]}")
outContent=${outContent:1}

echo "module.exports = [" > $outfile
echo $outContent >> $outfile
echo "];" >> $outfile

