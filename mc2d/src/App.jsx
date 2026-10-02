import "./App.css";
import { Suspense, lazy } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./common/queryClient";

import MainPage from "./MainPage";
import DetailPage from "./DetailPage";

import LoadingPage from "./LoadingPage";

// Lazy load Contributions to avoid prebundling Markdown js libraries.
const ContributionsPage = lazy(() => import("./ContributionsPage"));

const ContributionsIndexPage = lazy(() => import("./ContributionsIndexPage"));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<MainPage tab="about" />} />
          <Route path="/restapi" element={<MainPage tab="restapi" />} />
          <Route path="/details/:id" element={<DetailPage />} />
          <Route
            path="/contributions/"
            element={
              <Suspense fallback={<LoadingPage />}>
                <ContributionsIndexPage />
              </Suspense>
            }
          />
          <Route
            path="/contributions/:page"
            element={
              <Suspense fallback={<LoadingPage />}>
                <ContributionsPage />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
