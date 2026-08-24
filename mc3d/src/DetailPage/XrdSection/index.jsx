import { useState, useEffect, useRef, useMemo } from "react";
import Plotly from "plotly.js-basic-dist-min";
import Form from "react-bootstrap/Form";
import { Container, Row, Col } from "react-bootstrap";

import { McloudSpinner } from "mc-react-library";

import { wavelengthName, getFittedCurve, getHistogram } from "./utils.js";

import BundleAndDownload from "./BundleAndDownload.jsx";

const WAVELENGTHS = ["CuKa", "MoKa", "CrKa", "FeKa", "CoKa", "AgKa"];

import { loadXrdWavelength } from "../../common/fetchingUtils.js";

const XrdSection = ({ method, id }) => {
  const plotRef = useRef(null);
  const previous = useRef(null);

  const [cache, setCache] = useState({});
  const [error, setError] = useState(null);

  const [wavelength, setWavelength] = useState(WAVELENGTHS[0]);

  const [fitType, setFitType] = useState("Gaussian");
  const [fwhm, setFwhm] = useState(1.0);

  const [showCurve, setShowCurve] = useState(true);
  const [showHistogram, setShowHistogram] = useState(true);

  const current = cache[wavelength];

  const isLoading = !error && Object.keys(cache).length === 0;

  // Fetch missing wavelength
  useEffect(() => {
    if (!wavelength || cache[wavelength]) return;

    let cancelled = false;

    const fetchData = async () => {
      try {
        setError(null);

        const data = await loadXrdWavelength({
          method: method,
          id: id,
          wavelength,
        });

        if (cancelled) return;

        setCache((prev) => ({
          ...prev,
          [wavelength]: data,
        }));
      } catch (err) {
        if (!cancelled) {
          setError("Data not available for this material.");
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [wavelength, cache, id, method]);

  useEffect(() => {
    if (current) {
      previous.current = current;
    }
  }, [current]);

  const plotData = useMemo(() => {
    if (!current) return [];

    const traces = [];

    if (showHistogram) {
      traces.push(getHistogram(current));
    }

    if (showCurve) {
      traces.push(getFittedCurve(current, fwhm, fitType));
    }

    return traces;
  }, [current, showHistogram, showCurve, fwhm, fitType]);

  const xRange = current?.angular_range?.slice() || [];

  useEffect(() => {
    if (!plotRef.current || !current) return;

    const layout = {
      showlegend: false,

      xaxis: {
        range: xRange,
        title: "2\u03F4 [°]",
        linecolor: "black",
        linewidth: 1,
        tickwidth: 1,
        tickcolor: "black",
        gridcolor: "lightgray",
        mirror: true,
      },

      yaxis: {
        range: [0, null],
        title: "Intensity [a.u.]",
        linecolor: "black",
        linewidth: 1,
        tickwidth: 1,
        tickcolor: "black",
        gridcolor: "lightgray",
        mirror: true,
      },

      margin: {
        l: 50,
        r: 20,
        b: 40,
        t: 20,
      },
    };

    Plotly.react(plotRef.current, plotData, layout, {
      responsive: true,
    });

    return () => {
      if (plotRef.current) {
        Plotly.purge(plotRef.current);
      }
    };
  }, [current, plotData, xRange]);

  if (error) {
    return (
      <div>
        <div className="section-heading">X-ray diffraction pattern</div>
        <Container fluid className="section-container">
          <Row>
            <div className="xrd-section">
              <div style={{ padding: "16px", textAlign: "center" }}>
                {error}
              </div>
            </div>
          </Row>
        </Container>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="section-heading">
        X-ray diffraction pattern
        <Container fluid className="section-container">
          <Row>
            <div
              style={{
                width: "150px",
                padding: "40px",
                margin: "0 auto",
              }}
            >
              <McloudSpinner />
            </div>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <div className="section-heading">X-ray diffraction pattern</div>
      <Container fluid className="section-container">
        <Row>
          <div className="xrd-section">
            <Row>
              <Col style={{ minWidth: "300px" }}>
                <Form>
                  <Form.Label>Select the X-ray source</Form.Label>

                  <Form.Select
                    value={wavelength}
                    onChange={(e) => setWavelength(e.target.value)}
                  >
                    {WAVELENGTHS.map((wl) => (
                      <option key={wl} value={wl}>
                        {wavelengthName(wl)}
                      </option>
                    ))}
                  </Form.Select>
                </Form>

                <Form>
                  <Form.Label>Select peak broadening profile</Form.Label>

                  <Form.Select
                    value={fitType}
                    onChange={(e) => setFitType(e.target.value)}
                  >
                    {["Gaussian", "Lorentzian"].map((ft) => (
                      <option key={ft} value={ft}>
                        {ft}
                      </option>
                    ))}
                  </Form.Select>
                </Form>

                <Form>
                  <Form.Label>
                    Select peak broadening FWHM (full width at half maximum)
                    <br />
                    value: {fwhm.toFixed(2)}
                  </Form.Label>

                  <Form.Range
                    min={0.1}
                    max={2.0}
                    step={0.05}
                    value={fwhm}
                    onChange={(e) => setFwhm(parseFloat(e.target.value))}
                  />
                </Form>

                <Form>
                  <Form.Check
                    checked={showCurve}
                    onChange={(e) => setShowCurve(e.target.checked)}
                    label="Show broadened curve"
                  />

                  <Form.Check
                    checked={showHistogram}
                    onChange={(e) => setShowHistogram(e.target.checked)}
                    label="Show histogram"
                  />
                </Form>

                <div>
                  Download X-ray data
                  <BundleAndDownload
                    cache={cache}
                    setCache={setCache}
                    method={method}
                    id={id}
                  />
                </div>
              </Col>

              <Col>
                <div
                  ref={plotRef}
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "340px",
                    minWidth: "300px",
                  }}
                />
              </Col>
            </Row>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default XrdSection;
