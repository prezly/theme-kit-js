#/usr/bin/bash

COMMIT=`git log | head -n1 | cut -d\  -f2`
VERSION=0.0.0-next-$COMMIT

echo Preparing $VERSION

npx lerna version $VERSION --no-push --no-git-tag-version --yes

npm run sync-package-versions

npm install

npm run build

git add lerna.json \
        package-lock.json \
        packages/core/package.json \
        packages/intl/package.json \
        packages/nextjs/package.json \
        packages/ui/package.json

git commit -m "v$VERSION"

npx lerna publish --dist-tag next from-package