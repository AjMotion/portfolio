import { jsxs, jsx } from "react/jsx-runtime";
function Index() {
  return /* @__PURE__ */ jsxs("div", { style: {
    padding: "2rem",
    textAlign: "center"
  }, children: [
    /* @__PURE__ */ jsx("h1", { children: "Welcome to Portfolio" }),
    /* @__PURE__ */ jsx("p", { children: "Your portfolio is ready to go!" })
  ] });
}
export {
  Index as component
};
