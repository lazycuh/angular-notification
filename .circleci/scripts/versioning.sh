#!/bin/bash

set -e

if [ "$CIRCLE_BRANCH" != "main" ]
then
    echo "Not on main branch, skipping versioning."
    exit 0
fi

LATEST_COMMIT_MESSAGE=$(git log -n 1 --format=%s | tr -d "\n")

if [[ "$LATEST_COMMIT_MESSAGE" == "Bumped version to"* ]]; then
    echo "Versioning has already occurred, exiting."
    exit 0
fi

function matchCommitMessagePattern {
    KEYWORD_PATTERN="$1"

    echo $LATEST_COMMIT_MESSAGE | sed -E "s/^-[[:space:]]*//" | grep -iE "^($KEYWORD_PATTERN)(\(.+\))?\s*:" | wc -l | awk "{print \$1}"
}

function extractVersionFromPackageJsonFile {
    cat package.json | grep version | cut -d'"' -f 4 | head -n 1
}

function bumpPackageVersion {
    if [ $(matchCommitMessagePattern "build|chore|ci|docs|fix|perf|refactor|style|test") != "0" ]; then
        npm version patch --no-git-tag-version
    elif [ $(matchCommitMessagePattern "feat") != "0" ]; then
        npm version minor --no-git-tag-version
    elif [ $(matchCommitMessagePattern "breaking(\s*change)?") != "0" ]; then
        npm version major --no-git-tag-version
    else
        echo "Commit message should start with a valid type, please see https://github.com/babybeet/angular-notification/blob/main/CONTRIBUTING.md to learn more"
        npm version minor --no-git-tag-version
    fi

    extractVersionFromPackageJsonFile
}

if [ $(matchCommitMessagePattern "feat|fix|build|chore|ci|docs|perf|refactor|style|test|breaking(\s*change)?") != "0" ]; then
    bumpPackageVersion
    NEW_VERSION=$(extractVersionFromPackageJsonFile)
    cd projects/angular-notification
    npm version "$NEW_VERSION" --no-git-tag-version
    cd ../..

    git config --global user.email "circleci@email.com"
    git config --global user.name "CircleCI"

    git add {.,projects/angular-notification}/package.json
    git commit -m "Bumped version to $NEW_VERSION for release build"
    git push origin main

    NEW_TAG="v$NEW_VERSION"
    git tag "$NEW_TAG"
    git push origin "$NEW_TAG"
    echo "Created Git tag $NEW_TAG."
    exit 1
else
    echo "Commit message does not start with /fix|refactor|feat|breaking(\s*change)?/, no versioning will be performed."
fi
