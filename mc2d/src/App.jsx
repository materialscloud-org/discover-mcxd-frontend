import "./App.css";
import { Suspense, lazy } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import MainPage from "./MainPage";
import DetailPage from "./DetailPage";

import LoadingPage from "./LoadingPage";

// Lazy load Contributions to avoid prebundling Markdown js libraries.
const ContributionsPage = lazy(() => import("./ContributionsPage"));

const ContributionsIndexPage = lazy(() => import("./ContributionsIndexPage"));

function App() {
  return (
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
  );
}

export default App;
