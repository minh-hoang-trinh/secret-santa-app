/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as LoginIndexImport } from './routes/login/index'
import { Route as DrawsIndexImport } from './routes/draws/index'
import { Route as DrawsDrawIdImport } from './routes/draws/$drawId'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const LoginIndexRoute = LoginIndexImport.update({
  id: '/login/',
  path: '/login/',
  getParentRoute: () => rootRoute,
} as any)

const DrawsIndexRoute = DrawsIndexImport.update({
  id: '/draws/',
  path: '/draws/',
  getParentRoute: () => rootRoute,
} as any)

const DrawsDrawIdRoute = DrawsDrawIdImport.update({
  id: '/draws/$drawId',
  path: '/draws/$drawId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/draws/$drawId': {
      id: '/draws/$drawId'
      path: '/draws/$drawId'
      fullPath: '/draws/$drawId'
      preLoaderRoute: typeof DrawsDrawIdImport
      parentRoute: typeof rootRoute
    }
    '/draws/': {
      id: '/draws/'
      path: '/draws'
      fullPath: '/draws'
      preLoaderRoute: typeof DrawsIndexImport
      parentRoute: typeof rootRoute
    }
    '/login/': {
      id: '/login/'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/draws/$drawId': typeof DrawsDrawIdRoute
  '/draws': typeof DrawsIndexRoute
  '/login': typeof LoginIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/draws/$drawId': typeof DrawsDrawIdRoute
  '/draws': typeof DrawsIndexRoute
  '/login': typeof LoginIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/draws/$drawId': typeof DrawsDrawIdRoute
  '/draws/': typeof DrawsIndexRoute
  '/login/': typeof LoginIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/draws/$drawId' | '/draws' | '/login'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/draws/$drawId' | '/draws' | '/login'
  id: '__root__' | '/' | '/draws/$drawId' | '/draws/' | '/login/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  DrawsDrawIdRoute: typeof DrawsDrawIdRoute
  DrawsIndexRoute: typeof DrawsIndexRoute
  LoginIndexRoute: typeof LoginIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  DrawsDrawIdRoute: DrawsDrawIdRoute,
  DrawsIndexRoute: DrawsIndexRoute,
  LoginIndexRoute: LoginIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/draws/$drawId",
        "/draws/",
        "/login/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/draws/$drawId": {
      "filePath": "draws/$drawId.tsx"
    },
    "/draws/": {
      "filePath": "draws/index.tsx"
    },
    "/login/": {
      "filePath": "login/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
