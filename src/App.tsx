import { useEffect, useState } from "react";
import SentimentChart from "./SentimentChart";

interface RawItem {
  ticker: string;
  day: string;
  amount: number;
}

function App() {
  const [buys, setBuys] = useState<RawItem[]>([]);
  const [sells, setSells] = useState<RawItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "data/insider-activity-5yr.json")
      .then((r) => r.json())
      .then((data) => {
        setBuys(data.buys || []);
        setSells(data.sells || []);
      })
      .catch((err) => console.error("Failed to load insider data:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "3rem 2rem 6rem",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#1a1a1a",
      backgroundColor: "#ffffff",
      lineHeight: "1.7",
    }}>

      {/* Title block */}
      <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid #e5e5e5", paddingBottom: "1.5rem" }}>
        <p style={{ fontSize: "0.78rem", color: "#888", margin: "0 0 0.5rem", fontFamily: "monospace", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          CMSC 471 · Interactive Data Visualization · Assignment 1 · Spring 2026
        </p>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "normal", margin: "0 0 0.5rem", lineHeight: 1.3, color: "#111" }}>
          Insider Sentiment Dashboard
        </h1>
        <p style={{ margin: 0, color: "#555", fontSize: "0.95rem" }}>
          Corporate insider buy/sell activity across S&P 500 sectors — five-year window, SEC Form 4 filings
        </p>
      </div>

      {/* Section 1 */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: "bold", margin: "0 0 0.6rem", color: "#111", fontFamily: "'Roboto', system-ui, sans-serif" }}>
          1&nbsp;&nbsp;Dataset &amp; Background
        </h2>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.92rem" }}>
          This visualization draws on five years of U.S. corporate insider trading disclosures from SEC Form 4 filings (2020–2025).
          Form 4 must be filed within two business days whenever a director, officer, or 10%-or-greater shareholder buys or sells
          shares of their own company. Because insiders have privileged knowledge of their firm's prospects, the aggregate direction
          of their trades is widely used as a leading sentiment indicator.
        </p>
        <p style={{ margin: 0, fontSize: "0.92rem" }}>
          Each record captures a <em>ticker</em>, <em>transaction date</em>, and <em>dollar amount</em>, classified as either a buy or
          a sell. Tickers are mapped to one of eleven GICS sectors (Technology, Financials, Health Care, etc.) using a 532-ticker
          lookup derived from S&P 500 constituent lists. The primary variable is the daily <em>buy ratio</em>: the fraction of unique
          tickers with at least one buy in a trailing 14-day window, normalized per sector to account for differences in baseline activity levels.
        </p>
      </section>

      {/* Visualization cell */}
      <div style={{
        backgroundColor: "#0f172a",
        borderRadius: "6px",
        padding: "1rem",
        margin: "2rem 0",
      }}>
        <SentimentChart buys={buys} sells={sells} loading={loading} />
      </div>

      {/* Section 2 */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: "bold", margin: "0 0 0.6rem", color: "#111", fontFamily: "'Roboto', system-ui, sans-serif" }}>
          2&nbsp;&nbsp;Design Rationale &amp; Interactions
        </h2>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.92rem" }}>
          The dashboard centers on two coordinated views sharing a common time axis: a <em>rolling 14-day heat strip</em> and
          a <em>1-year ETF candlestick chart</em>.
        </p>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.92rem" }}>
          <strong>Visual encodings.</strong> Color encodes the buy/sell ratio using a diverging palette (red → neutral gray → green),
          normalized per sector with a ±2σ band around each sector's own historical mean. Per-sector normalization was chosen
          over a global scale because sectors differ dramatically in baseline insider activity; a global scale would wash out
          intra-sector variation. Opacity encodes transaction <em>volume</em> so visually bright cells signal both directional
          conviction and a meaningful sample size. Price data uses conventional candlestick encoding for direct comparison with sentiment.
        </p>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.92rem" }}>
          <strong>Alternatives considered.</strong> An early design used a half-monthly aggregated heatmap binned into ~24 periods per year.
          While easier to scan, the coarse resolution obscured short-lived spikes that often precede earnings announcements.
          The continuous 14-day rolling strip preserves temporal resolution while smoothing daily noise.
          A stacked bar chart was considered for sector comparison but rejected because it is harder to track a single sector across time.
        </p>

        <p style={{ margin: "0 0 0.5rem", fontSize: "0.92rem" }}><strong>Implemented interactions:</strong></p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", marginBottom: "0.5rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
              <th style={{ padding: "0.4rem 0.75rem 0.4rem 0", fontWeight: "600", fontFamily: "'Roboto', system-ui, sans-serif", width: "22%" }}>Interaction</th>
              <th style={{ padding: "0.4rem 0.75rem 0.4rem 0", fontWeight: "600", fontFamily: "'Roboto', system-ui, sans-serif", width: "16%" }}>Category</th>
              <th style={{ padding: "0.4rem 0", fontWeight: "600", fontFamily: "'Roboto', system-ui, sans-serif" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem 0.75rem 0.5rem 0", verticalAlign: "top" }}>Brushing &amp; linking</td>
              <td style={{ padding: "0.5rem 0.75rem 0.5rem 0", verticalAlign: "top", color: "#555" }}>Cat. I</td>
              <td style={{ padding: "0.5rem 0", verticalAlign: "top" }}>Dragging on the heat strip dims out-of-range candles and draws dashed boundary lines on the candlestick chart. Dragging on the candlestick highlights the same range on the strip. The two brushes are mutually exclusive.</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem 0.75rem 0.5rem 0", verticalAlign: "top" }}>Dynamic filter</td>
              <td style={{ padding: "0.5rem 0.75rem 0.5rem 0", verticalAlign: "top", color: "#555" }}>Cat. I</td>
              <td style={{ padding: "0.5rem 0", verticalAlign: "top" }}>Clicking any sector row switches the candlestick chart to that sector's SPDR ETF (e.g., XLK for Technology, XLF for Financials), enabling direct comparison of insider sentiment and sector price action.</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem 0.75rem 0.5rem 0", verticalAlign: "top" }}>Details-on-demand</td>
              <td style={{ padding: "0.5rem 0.75rem 0.5rem 0", verticalAlign: "top", color: "#555" }}>Cat. II</td>
              <td style={{ padding: "0.5rem 0", verticalAlign: "top" }}>Hovering over a heat strip cell shows a tooltip with sector, date, trailing 14-day buy/sell counts, ratio, and transaction volume.</td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem 0.75rem 0.5rem 0", verticalAlign: "top" }}>Highlighting</td>
              <td style={{ padding: "0.5rem 0.75rem 0.5rem 0", verticalAlign: "top", color: "#555" }}>Cat. II</td>
              <td style={{ padding: "0.5rem 0", verticalAlign: "top" }}>The active sector row is outlined in yellow. Candles outside a brush selection are dimmed to 30% opacity. ESC clears any active selection.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Section 3 */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: "bold", margin: "0 0 0.6rem", color: "#111", fontFamily: "'Roboto', system-ui, sans-serif" }}>
          3&nbsp;&nbsp;References
        </h2>
        <ol style={{ margin: 0, paddingLeft: "1.5rem", fontSize: "0.92rem" }}>
          <li style={{ marginBottom: "0.4rem" }}>SEC EDGAR Form 4 filings. <em>U.S. Securities and Exchange Commission</em>. <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=4" target="_blank" rel="noreferrer" style={{ color: "#1a56db" }}>sec.gov</a>.</li>
          <li style={{ marginBottom: "0.4rem" }}>SPDR Select Sector ETF historical prices (XLK, XLF, XLV, XLE, XLI, XLY, XLP, XLC, XLRE, XLU, XLB, SPY). <em>Yahoo Finance</em>.</li>
          <li style={{ marginBottom: "0.4rem" }}>S&P 500 GICS sector constituent classifications, Q1 2025.</li>
          <li style={{ marginBottom: "0.4rem" }}>Bostock, M. et al. D3.js — Data-Driven Documents. <a href="https://d3js.org" target="_blank" rel="noreferrer" style={{ color: "#1a56db" }}>d3js.org</a>.</li>
        </ol>
      </section>

      {/* Section 4 */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: "bold", margin: "0 0 0.6rem", color: "#111", fontFamily: "'Roboto', system-ui, sans-serif" }}>
          4&nbsp;&nbsp;Development Process
        </h2>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.92rem" }}>
          This project was developed individually. Total effort was approximately <strong>12 hours</strong>,
          split across three phases: data acquisition and cleaning (~4 hrs), visualization design and iteration (~6 hrs),
          and UI polish and deployment (~2 hrs).
        </p>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.92rem" }}>
          The most time-consuming aspect was the linked brush implementation. Several design iterations were also needed before settling on per-sector ±2σ normalization for the color scale.
        </p>
      </section>

      {/* Section 5 */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: "bold", margin: "0 0 0.6rem", color: "#111", fontFamily: "'Roboto', system-ui, sans-serif" }}>
          5&nbsp;&nbsp;AI Assistance
        </h2>
        <p style={{ margin: 0, fontSize: "0.92rem" }}>
          Claude Code (Anthropic) was used as a coding assistant throughout — primarily to accelerate D3 boilerplate
          (axis setup, brush configuration, scale definitions) and to debug React/D3 integration issues. All visualization design decisions, data modeling choices, and analytical
          framing were made by the author.
        </p>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid #e5e5e5", margin: "3rem 0 1.5rem" }} />
      <p style={{ fontSize: "0.78rem", color: "#aaa", margin: 0, fontFamily: "'Roboto', system-ui, sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>CMSC 471 · Interactive Data Visualization · Spring 2026</span>
        <a href="https://github.com/gselez6761/insider-sentiment" target="_blank" rel="noreferrer" style={{ color: "#aaa", textDecoration: "none" }}>GitHub</a>
      </p>
    </div>
  );
}

export default App;
