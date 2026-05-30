import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

// Mantine styles must be imported before your own.
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import App from "./App.jsx";

// Your personalization starts here — pick an accent color you like.
// Mantine has: blue, cyan, grape, green, indigo, lime, orange, pink,
// red, teal, violet, yellow. I've used 'teal'; make it yours.
const theme = createTheme({
  primaryColor: "teal",
  defaultRadius: "md",
  fontFamily: "Inter, system-ui, sans-serif",
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>
);