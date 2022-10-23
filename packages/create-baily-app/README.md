<h1 align="center">
  create-baily-app
</h1>

<p align="center">
  Simple CLI to quickly setup an opinionated "Baily" app
</p>

<p align="center">
  Get started by running <code>npx create-baily-app@latest</code>
</p>

<div align="center">

[![Build Status](https://github.com/tj/commander.js/workflows/build/badge.svg)](https://github.com/tj/commander.js/actions?query=workflow%3A%22build%22)
[![NPM Downloads](https://img.shields.io/npm/dm/commander.svg?style=flat)](https://npmcharts.com/compare/commander?minimal=true)
[![Install Size](https://packagephobia.now.sh/badge?p=commander)](https://packagephobia.now.sh/result?p=commander)

</div>

### What is a _baily_ app?

I, Baily Troyer, suffer from **_never finish anything syndrome_** which means I often re-bootstrap applications when I have a new shower thought -- "hey, I should build <new_random_thing>."

So I made `create-baily-app` to do one thing: **_make it easier for me to copypasta the same boilerplate app depending on my usecase_**.

If you're looking for a production grade app-starter **this is not the place**, I take no responsibility whatsoever for this template other than its my baseline for anything I build on the web.

<p align="center">
  <img src="https://static.wikia.nocookie.net/adventuresofjimmyneutron/images/a/ad/Calamitous.jpg/revision/latest?cb=20130425122121" alt="Professor Calamitous from Jimmy Neutron" />
</p>

> Professor Calamitous was once a brilliant little boy, who never finished anything, from food to even his sentences. His inability to finish things lead him to never finishing his homework as noted by Ms. Fowl which strengthens the idea he was held bac

<h2 id="getting-started">Getting Started</h2>

To get started with `create-baily-app`, run any of the following three commands and answer the prompts:

### npm

```bash
npx create-baily-app@latest
```

### pnpm

```bash
pnpm dlx create-baily-app@latest
```

<h2 id="cli">CLI Docs</h2>

The following CLI options and flags can configure the create command with custom behavior:

| Option/Flag       | Description                                                             |
| ----------------- | ----------------------------------------------------------------------- |
| `[dir]`           | Include a directory argument with a name for the project                |
| `--noGit`         | Explicitly tell the CLI to not initialize a new git repo in the project |
| `-y`, `--default` | Bypass the CLI and use all default options to bootstrap a new t3-app    |
| `--noInstall`     | Generate project without installing dependencies                        |
