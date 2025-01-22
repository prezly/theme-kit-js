#/usr/bin/bash

COMMIT=`git log | head -n1 | cut -d\  -f2`
VERSION=0.0.0-next-$COMMIT

echo Preparing $VERSION

pnpm exec lerna version $VERSION --no-push --no-git-tag-version --yes

pnpm sync-package-versions

pnpm install

pnpm build

git add lerna.json \
        package-lock.json \
        packages/core/package.json \
        packages/intl/package.json \
        packages/react/package.json \
        packages/nextjs/package.json \
        packages/ui/package.json

git commit -m "v$VERSION"

pnpm exec lerna publish --dist-tag next from-package