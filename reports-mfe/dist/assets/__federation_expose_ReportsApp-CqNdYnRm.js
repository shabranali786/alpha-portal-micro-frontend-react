import { importShared } from './__federation_fn_import-BFo6b6m_.js';
import { j as jsxRuntimeExports } from './jsx-runtime-BLp14W7u.js';

const scriptRel = /* @__PURE__ */ (function detectScriptRel() {
	const relList = typeof document !== "undefined" && document.createElement("link").relList;
	return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
})();const assetsURL = function(dep) { return "/"+dep };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (true               && deps && deps.length > 0) {
		document.getElementsByTagName("link");
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises$2) {
			return Promise.all(promises$2.map((p) => Promise.resolve(p).then((value$1) => ({
				status: "fulfilled",
				value: value$1
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		promise = allSettled(deps.map((dep) => {
			dep = assetsURL(dep);
			if (dep in seen) return;
			seen[dep] = true;
			const isCss = dep.endsWith(".css");
			const cssSelector = isCss ? "[rel=\"stylesheet\"]" : "";
			if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
			const link = document.createElement("link");
			link.rel = isCss ? "stylesheet" : scriptRel;
			if (!isCss) link.as = "script";
			link.crossOrigin = "";
			link.href = dep;
			if (cspNonce) link.setAttribute("nonce", cspNonce);
			document.head.appendChild(link);
			if (isCss) return new Promise((res, rej) => {
				link.addEventListener("load", res);
				link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
			});
		}));
	}
	function handlePreloadError(err$2) {
		const e$1 = new Event("vite:preloadError", { cancelable: true });
		e$1.payload = err$2;
		window.dispatchEvent(e$1);
		if (!e$1.defaultPrevented) throw err$2;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};

const {lazy} = await importShared('react');

const {Routes,Route} = await importShared('react-router-dom');

const UnitReport = lazy(() => __vitePreload(() => import('./UnitReport-Mj0pVYa1.js'),true              ?[]:void 0));
const SalesReport = lazy(() => __vitePreload(() => import('./SalesReport-CVZ4c4sp.js'),true              ?[]:void 0));
const MerchantReport = lazy(() => __vitePreload(() => import('./MerchantReport-ZebFfKRL.js'),true              ?[]:void 0));
const TeamWiseReport = lazy(() => __vitePreload(() => import('./TeamWiseReport-DSuJPXiz.js'),true              ?[]:void 0));
const UnitWiseReport = lazy(() => __vitePreload(() => import('./UnitWiseReport-DpVc00zM.js'),true              ?[]:void 0));
const CombinedSalesReport = lazy(() => __vitePreload(() => import('./CombinedSalesReport-DKNfkbIp.js'),true              ?[]:void 0));
function ReportsApp() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/unit-reports", element: /* @__PURE__ */ jsxRuntimeExports.jsx(UnitReport, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/sales-reports", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SalesReport, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/merchant-reports", element: /* @__PURE__ */ jsxRuntimeExports.jsx(MerchantReport, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/team-reports", element: /* @__PURE__ */ jsxRuntimeExports.jsx(TeamWiseReport, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/unit-wise-reports", element: /* @__PURE__ */ jsxRuntimeExports.jsx(UnitWiseReport, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/combined-sales-reports", element: /* @__PURE__ */ jsxRuntimeExports.jsx(CombinedSalesReport, {}) })
  ] });
}

export { ReportsApp as default };
