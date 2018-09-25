#!/bin/bash
cd "/data/config"
git fetch
commits="$(git rev-list --count master..origin/master)"
dev_commits="$(git rev-list --count dev..origin/dev)"

branch="$(git branch | grep \* | cut -d ' ' -f2)"

curl -X POST -H "x-ha-access: $1" -H "Content-Type: application/json" http://127.0.0.1:8123/api/states/sensor.new_commits -d "{\"state\": \"$commits\"}"
curl -X POST -H "x-ha-access: $1" -H "Content-Type: application/json" http://127.0.0.1:8123/api/states/sensor.new_dev_commits -d "{\"state\": \"$dev_commits\"}"
curl -X POST -H "x-ha-access: $1" -H "Content-Type: application/json" http://127.0.0.1:8123/api/states/sensor.current_branch -d "{\"state\": \"$branch\"}"
