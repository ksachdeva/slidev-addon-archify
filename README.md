# slidev-addon-archify

A Slidev addon for bringing Archify diagrams and stories into presentations. This repository currently contains the addon scaffold; Archify features are not implemented yet.

## Local development

Use Node.js 22.22.0 or newer and pnpm.

```sh
pnpm install
pnpm dev
```

The preview deck, [`showcase/slides.md`](showcase/slides.md), loads the addon from the repository root. Run `pnpm build` to build the preview into `showcase/dist/`.

## Deploy the showcase

In the GitHub repository, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. Then push to `main` or run **Deploy showcase to GitHub Pages** on `main` from the Actions tab. The workflow builds the deck against the addon in this checkout and publishes it at <https://ksachdeva.github.io/slidev-addon-archify/>. No npm release is needed.

## Release the addon to npm

The **Publish addon to npm** workflow runs only when manually triggered on `main`. By default it previews the package contents without publishing. The showcase is not included in the npm package.

1. When the addon is ready for its first release, sign in with `npm login` and run `npm publish --access public` from the repository root to create the package on npm.
2. In the package's npm settings, add a [GitHub Actions trusted publisher](https://docs.npmjs.com/trusted-publishers/) for owner `ksachdeva`, repository `slidev-addon-archify`, and workflow filename `publish-npm.yml`. Leave the environment blank and enable **Allow npm publish**. No GitHub npm token secret is needed.
3. For each later release, bump `version` in `package.json`, push the change to `main`, then run **Publish addon to npm** with the publish option checked.
