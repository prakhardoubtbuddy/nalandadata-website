import React from "react";
import ReactDOM from "react-dom/client";
import posthog from "posthog-js";
import "@/index.css";
import App from "@/App";

if (process.env.REACT_APP_POSTHOG_KEY) {
  posthog.init(process.env.REACT_APP_POSTHOG_KEY, {
    api_host: process.env.REACT_APP_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: false, // tracked manually on each route change
    capture_pageleave: true,
    persistence: "localStorage+cookie",
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
