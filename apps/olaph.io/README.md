# Olaph.io

A revitalization of the once dead Olaph.io slack standup bot. All end functionality is reverse engineered from the original [codebase](https://github.com/kreait/olaph-slack-app) developed by kreait.

## Overview

Standups are a tracked collection of checkins that occur at a configured cadence. Checkins are a series of Q/A prompts with optional polls baked in.

**Why use olaph**

1. You want a simple OS & free solution that doesn't add unecessary feature bloat in your standup process
2. You want to track progress over time + add hidden anonymous polls
3. Slack is your teams' method of communication ... no **new tools**

## New Features

1. Optional questions
2. Polls (anon/pub)
3. Summaries
4. Custom Cadence + Questions (e.g. Tuesday standup with A set and Friday standup with B set)
5. Slack user statuses (if :vacation: then don't message / Ping)
6. Listener only users (whitelist of people NOT to ping in channel)

### Near realtime

- when user leaves channel this gets synced
- when a user joins a channel the bot DM's them about how to use

### Configuring the bot in api.slack.com

@todo

## Deploying your own instance on Vercel

## Deploying privately with Kubernetes

## Running locally

1. Update Settings in [Slack API](https://api.slack.com/apps/A04839AU8AD?created=1)
2. Access [Slack Workspace](https://join.slack.com/t/olaphworkspace/shared_invite/zt-1ip4umeps-vt_uFHFOpy1lSUoJTT~MGA)
