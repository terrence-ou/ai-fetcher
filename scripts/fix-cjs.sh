#!/bin/bash
# Find all .js files in ./dist/cjs/ and its subdirectories
find ./dist/cjs/ -type f -name "*.js" | while read -r file; do
  echo "Updating $file contents..."
  sed -i '' "s/\.js'/\.cjs'/g" "$file"
  echo "Renaming $file to ${file%.js}.cjs..."
  mv "$file" "${file%.js}.cjs"
done
