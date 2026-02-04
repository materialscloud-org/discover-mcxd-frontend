import "./App.css";
import { Suspense, lazy } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import MainPage from "./MainPage";
import DetailPage from "./DetailPage";

import LoadingPage from "./LoadingPage";

// Lazy load Contributions to avoid prebundling Markdown js libraries.
const ContributionsPage = lazy(() => import("./ContributionsPage"));

// Chart.js plugins need to be registered outside the library
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";
Chart.register(zoomPlugin);
Chart.register(annotationPlugin);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<MainPage tab="about" />} />
        <Route path="/restapi" element={<MainPage tab="restapi" />} />
        <Route path="/details/:id" element={<DetailPage />} />
        <Route
          path="/contributions"
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
