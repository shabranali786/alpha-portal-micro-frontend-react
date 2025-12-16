
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    import {loadShare} from "@module-federation/runtime";
    const importMap = {
      
        "@headlessui/react": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild___mf_0_headlessui_mf_1_react__prebuild__.js");
            return pkg;
        }
      ,
        "@reduxjs/toolkit": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild___mf_0_reduxjs_mf_1_toolkit__prebuild__.js");
            return pkg;
        }
      ,
        "axios": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild__axios__prebuild__.js");
            return pkg;
        }
      ,
        "react": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild__react__prebuild__.js");
            return pkg;
        }
      ,
        "react-dom": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild__react_mf_2_dom__prebuild__.js");
            return pkg;
        }
      ,
        "react-hot-toast": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild__react_mf_2_hot_mf_2_toast__prebuild__.js");
            return pkg;
        }
      ,
        "react-redux": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild__react_mf_2_redux__prebuild__.js");
            return pkg;
        }
      ,
        "react-router-dom": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild__react_mf_2_router_mf_2_dom__prebuild__.js");
            return pkg;
        }
      
    }
      const usedShared = {
      
          "@headlessui/react": {
            name: "@headlessui/react",
            version: "2.2.9",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"@headlessui/react"}' must be provided by host`);
              }
              usedShared["@headlessui/react"].loaded = true
              const {"@headlessui/react": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^2.2.9",
              
            }
          }
        ,
          "@reduxjs/toolkit": {
            name: "@reduxjs/toolkit",
            version: "2.11.2",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"@reduxjs/toolkit"}' must be provided by host`);
              }
              usedShared["@reduxjs/toolkit"].loaded = true
              const {"@reduxjs/toolkit": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^2.11.2",
              
            }
          }
        ,
          "axios": {
            name: "axios",
            version: "1.13.2",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"axios"}' must be provided by host`);
              }
              usedShared["axios"].loaded = true
              const {"axios": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^1.13.2",
              
            }
          }
        ,
          "react": {
            name: "react",
            version: "19.2.3",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react"}' must be provided by host`);
              }
              usedShared["react"].loaded = true
              const {"react": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^19.1.1",
              
            }
          }
        ,
          "react-dom": {
            name: "react-dom",
            version: "19.2.3",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react-dom"}' must be provided by host`);
              }
              usedShared["react-dom"].loaded = true
              const {"react-dom": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^19.1.1",
              
            }
          }
        ,
          "react-hot-toast": {
            name: "react-hot-toast",
            version: "2.6.0",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react-hot-toast"}' must be provided by host`);
              }
              usedShared["react-hot-toast"].loaded = true
              const {"react-hot-toast": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^2.6.0",
              
            }
          }
        ,
          "react-redux": {
            name: "react-redux",
            version: "9.2.0",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react-redux"}' must be provided by host`);
              }
              usedShared["react-redux"].loaded = true
              const {"react-redux": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^9.2.0",
              
            }
          }
        ,
          "react-router-dom": {
            name: "react-router-dom",
            version: "7.10.1",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react-router-dom"}' must be provided by host`);
              }
              usedShared["react-router-dom"].loaded = true
              const {"react-router-dom": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^7.8.2",
              
            }
          }
        
    }
      const usedRemotes = [
                {
                  entryGlobalName: "salesMfe",
                  name: "salesMfe",
                  type: "module",
                  entry: "http://localhost:5001/remoteEntry.js",
                  shareScope: "default",
                }
          ,
                {
                  entryGlobalName: "financeMfe",
                  name: "financeMfe",
                  type: "module",
                  entry: "http://localhost:5002/remoteEntry.js",
                  shareScope: "default",
                }
          ,
                {
                  entryGlobalName: "reportsMfe",
                  name: "reportsMfe",
                  type: "module",
                  entry: "http://localhost:5003/remoteEntry.js",
                  shareScope: "default",
                }
          ,
                {
                  entryGlobalName: "accessControlMfe",
                  name: "accessControlMfe",
                  type: "module",
                  entry: "http://localhost:5004/remoteEntry.js",
                  shareScope: "default",
                }
          ,
                {
                  entryGlobalName: "brandsMfe",
                  name: "brandsMfe",
                  type: "module",
                  entry: "http://localhost:5005/remoteEntry.js",
                  shareScope: "default",
                }
          ,
                {
                  entryGlobalName: "documentsMfe",
                  name: "documentsMfe",
                  type: "module",
                  entry: "http://localhost:5006/remoteEntry.js",
                  shareScope: "default",
                }
          ,
                {
                  entryGlobalName: "configMfe",
                  name: "configMfe",
                  type: "module",
                  entry: "http://localhost:5007/remoteEntry.js",
                  shareScope: "default",
                }
          
      ]
      export {
        usedShared,
        usedRemotes
      }
      