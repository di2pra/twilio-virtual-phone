cd ./client
npm install
npm run build
mv build/ ../public
rm -R ./client
echo "hello world"