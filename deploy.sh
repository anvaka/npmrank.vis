#!/bin/sh
rm -rf build
mkdir build
npm run build
cd ./build
git init
git add .
git commit -m 'push to gh-pages'
git push --force git@github.com:anvaka/npmrank.vis.git master:gh-pages
