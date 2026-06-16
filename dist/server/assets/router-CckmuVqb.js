import { createRootRoute, Outlet, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
const Route$1 = createRootRoute({
  component: () => /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Outlet, {}) })
});
const $$splitComponentImporter = () => import("./index-DIyXr_XT.js");
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$1
});
const rootRouteChildren = {
  IndexRoute
};
const routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
const router = createRouter({ routeTree });
function getRouter() {
  return router;
}
export {
  getRouter
};
