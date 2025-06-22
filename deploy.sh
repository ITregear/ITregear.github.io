#!/usr/bin/env sh

# abort on errors
set -e

# clean
rm -rf dist

# build
npm run build

# navigate into the build output directory
cd dist

# copy index.html to 404.html
cp index.html 404.html

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

git init
git checkout -B main
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/ITregear/ITregear.github.io.git main:gh-pages

cd -

# clean up
rm -rf dist 