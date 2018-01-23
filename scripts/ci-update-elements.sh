#!/bin/bash

# Update the catalyst-elements and rebuild.
yarn upgrade -S @catalyst-elements
yarn run build

# If there has been no changes.
if [[ ! `git status --porcelain` ]]; then
  echo "No changes to commit, exiting."
  exit 0
fi

# Commit the update.
git add .
git commit -m "[CatalystElements Bot] - update_elements - [skip ci]"

# Get the tags already on this repo.
TAGS=$(curl -X GET https://gitlab.wgtn.cat-it.co.nz/api/v4/projects/1077/repository/tags | jq '.[] | .name' | tr -d \")
TAGS_ARR=(${TAGS// / })

# Regex for version.
VERSION_REGEX='^v?([0-9]+\.)?([0-9]+\.)?([0-9]+)$'

# Find the latest tag that is a version tag.
for i in "${TAGS_ARR[@]}"
do
  if [[ $i =~ $VERSION_REGEX ]]; then
    # Split the tag into it's parts
    TAG_BUFFER="$i.0.0"
    VERSION_ARR=(${TAG_BUFFER//./ })

    # Create the new tag name based of the last one.
    MAJOR=${VERSION_ARR[0]}
    MINOR=${VERSION_ARR[1]}
    BUILD=$((${VERSION_ARR[2]} + 1))
    NEW_VERSION="$MAJOR.$MINOR.$BUILD"

    # Create the tag.
    git tag -a $NEW_VERSION -m "Automatic Release - $NEW_VERSION"

    # Push the commit and the tag.
    git push

    # Create the release notes for tag.
    RELEASE_NOTES='## Bundled Elements\n\n'

    # Add information about the included elements to the release notes.
    ELEMENTS=($(grep "^\"@catalyst-elements/" yarn.lock))
    for ELEMENT in "${ELEMENTS[@]}"
    do
      ELEMENT_NAME=$(echo $ELEMENT | cut -d '@' -f 2 | cut -d '/' -f 2)
      ELEMENT_VERSION=$(yarn list --pattern @catalyst-elements/catalyst-flip-button --depth 0 | grep $ELEMENT_NAME | cut -d '@' -f 3)
      RELEASE_NOTES="$RELEASE_NOTES* [$ELEMENT_NAME](https://gitlab.wgtn.cat-it.co.nz/CatalystElements/$ELEMENT_NAME) $ELEMENT_VERSION\n"
    done

    # Submit the release notes.
    curl -X POST https://gitlab.wgtn.cat-it.co.nz/api/v4/projects/1077/repository/tags/$NEW_VERSION/release -d '{"tag_name":"$NEW_VERSION","description":"$(echo -e $RELEASE_NOTES)"}'
    break
  fi
done
