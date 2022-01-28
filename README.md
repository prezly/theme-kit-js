# NextJS Prezly Theme Kit

This library is a collection of data-fetching functions, hooks and utility functions to abstract some of the under-the-hood logic used by Prezly newsrooms and help developers create themes much faster with little boilerplate required.

## Adding the library to your NextJS theme

### npm

```Shell
npm install --save @prezly/theme-kit-nextjs
```

#### peerDependencies

This library is intended to be used with NextJS applications, so it requires `next`, `react` and `react-dom` to work. These should already be installed if you have an existing NextJS app. If you starting from scratch, use [`create-next-app`](https://nextjs.org/docs/api-reference/create-next-app) to quick-start the project.

To keep things fresh, we require at least NextJS 12 and React 17.

You can also install the dependencies manually
```Shell
npm install --save next react react-dom
npm install --save-dev @types/react @types/react-dom
```

----

Brought to you by [Prezly](https://www.prezly.com/?utm_source=github&utm_campaign=@prezly/theme-kit-nextjs).
