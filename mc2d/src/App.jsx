import "./App.css";

import { Routes, Route, HashRouter } from "react-router-dom";

import MainPage from "./MainPage";
import DetailPage from "./DetailPage";

// Chart.js plugins need to be registered outside the library
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";
Chart.register(zoomPlugin);
Chart.register(annotationPlugin);

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<MainPage tab="about" />} />
        <Route path="/restapi" element={<MainPage tab="restapi" />} />
        <Route path="/details/:id" element={<DetailPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
