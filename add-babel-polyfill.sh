npm install --save babel-polyfill
echo require\(\'babel-polyfill\'\) | cat - ./index.js > ./index-tmp.js
mv ./index-tmp.js ./index.js
sed -i -e 's/"add-babel-polyfill": ".*",/"add-babel-polyfill": "echo already added",/g' ./package.json
rm -- "$0"
