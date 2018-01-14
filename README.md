# [tylergaw.com](http://tylergaw.com)

My little corner of the Web since 2006.

## Local development.

This is static site built with Metalsmith.

Install node dependencies:

```
yarn
```

Run and initial build then start the development server and watchers.

```
yarn start
```

For one-off builds:

```
yarn build
```

## Deploying

Tyler, you still host this on your VPS on Rackspace. When you're ready to deploy changes run:

```
yarn release
```

You'll be prompted for your ssh password. Give it to the computer. Once you do,
the project will build with `yarn build` and the contents of `/build` will be uploaded to your server using `scp`.
