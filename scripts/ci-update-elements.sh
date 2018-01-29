#!/bin/bash

# Install the dependencies, update the catalyst-elements and rebuild.
yarn install
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

# Get latest tag.
TAG=$(git describe --abbrev=0 --tags)

# Regex for version.
VERSION_REGEX='^v?([0-9]+\.)?([0-9]+\.)?([0-9]+)$'

# If the tag is a version number.
if [[ $TAG =~ $VERSION_REGEX ]]; then
  # Split the tag into it's parts
  TAG_BUFFER="$TAG.0.0"
  VERSION_ARR=(${TAG_BUFFER//./ })

  # Create the new tag name based of the last one.
  MAJOR=${VERSION_ARR[0]}
  MINOR=${VERSION_ARR[1]}
  BUILD=$((${VERSION_ARR[2]} + 1))
  NEW_TAG="$MAJOR.$MINOR.$BUILD"

  # Create the tag.
  git tag -a $NEW_TAG -m "Automatic Release - $NEW_TAG"

  # Push the commit and the tag.
  echo "Pushing commit and new tag."
  git push

  # Create the release notes for the tag.
  RELEASE_NOTES='## Bundled Elements\n\n'

  # Add information about the included elements to the release notes.
  ELEMENTS=($(grep "^\"@catalyst-elements/" yarn.lock))
  for ELEMENT in "${ELEMENTS[@]}"
  do
    ELEMENT_NAME=$(echo $ELEMENT | cut -d '@' -f 2 | cut -d '/' -f 2)
    ELEMENT_VERSION=$(yarn list --pattern @catalyst-elements/$ELEMENT_NAME --depth 0 | grep $ELEMENT_NAME | cut -d '@' -f 3)
    RELEASE_NOTES="$RELEASE_NOTES* [$ELEMENT_NAME](https://gitlab.wgtn.cat-it.co.nz/CatalystElements/$ELEMENT_NAME) $ELEMENT_VERSION\n"
  done

  # Submit the release notes.
  echo "Submitting release notes."
  curl -X POST https://gitlab.wgtn.cat-it.co.nz/api/v4/projects/1077/repository/tags/$NEW_TAG/release --header "PRIVATE-TOKEN: $PROJECT_TOKEN" --data-urlencode "tag_name=$NEW_TAG" --data-urlencode "description=$(echo -e $RELEASE_NOTES)"

# Tag isn't a version number.
else
  # Report tag not created.
  echo "Cannot automatically create new tag; the current tag ($TAG) is not a version number."
  echo "Please create the tag manually."

  # Push the commit.
  echo "Pushing commit."
  git push
fi
