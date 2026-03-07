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
          Corporate insider buy/sell activity across S&P 500 sectors — Feb 28 2025 – Feb 28 2026, SEC Form 4 filings
        </p>
      </div>

      {/* Section 1 */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: "bold", margin: "0 0 0.6rem", color: "#111", fontFamily: "'Roboto', system-ui, sans-serif" }}>
          1&nbsp;&nbsp;Dataset &amp; Background
        </h2>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.92rem" }}>
          This visualization draws on one year of U.S. corporate insider trading disclosures from SEC Form 4 filings (Feb 28 2025 – Feb 28 2026).
          Form 4 must be filed within two business days whenever a director, officer, or 10%-or-greater shareholder buys or sells
          shares of their own company.
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

      {/* Key Findings */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: "bold", margin: "0 0 0.6rem", color: "#111", fontFamily: "'Roboto', system-ui, sans-serif" }}>
          Key Findings
        </h2>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.92rem" }}>
          Three recurring troughs in insider buy activity are visible across nearly all sectors: one spanning roughly
          <strong> January 1 – March 1</strong>, another from <strong>June 1 – August 1</strong>, and a third from <strong>September 1 – November 1</strong>. These
          depressions are consistent with corporate <em>insider trading blackout periods</em> — windows during which
          companies prohibit officers and directors from transacting in company stock to prevent trading on material
          non-public information ahead of earnings.
        </p>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.92rem" }}>
          The January–March trough precedes Q4 earnings season (results typically reported mid-January through
          late February), the June–August trough precedes Q2 earnings (mid-July through mid-August), and the
          September–November trough precedes Q3 earnings (mid-October through mid-November). Most large-cap
          companies enforce blackout windows of 30–60 days before each quarterly release, which maps closely onto
          the observed activity gaps.
        </p>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.92rem" }}>
          A second pattern aligns with the contrarian buying behavior documented by Jeng (2003): insiders purchase
          into sector-level price pressure, positioning ahead of recoveries the broader market has not yet priced in.
        </p>
        <p style={{ margin: "0 0 0.4rem", fontSize: "0.92rem" }}><strong>Notable examples:</strong></p>
        <ul style={{ margin: "0 0 0.75rem", paddingLeft: "1.5rem", fontSize: "0.92rem" }}>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Energy · Apr 15 – Apr 30, 2025.</strong> The "Liberation Day" tariff shock (April 2) erased
            $6.6 trillion in market value over two days and drove WTI crude to a four-year low of $54/bbl on
            recession fears and a Saudi-led OPEC+ supply pivot. Energy insiders bought aggressively into the
            trough, recognizing that oil and gas imports were explicitly exempt from the tariffs and that WTI
            below $60/bbl was under Permian Basin replacement cost — a structural floor the market was ignoring.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Health Care, Communication Services, Consumer Staples &amp; Real Estate · Aug 5 – Aug 25, 2025.</strong> Conflicting
            PMI signals — S&amp;P Global at 53.0 (expansion) versus ISM at 48.7 (sixth consecutive contraction month)
            — created broad uncertainty about whether the economy was recovering or deteriorating. Insiders in Health
            Care likely saw the market's hesitation as an opportunity, buying into a sector receiving major domestic
            capital commitments (Johnson &amp; Johnson $2B, Genentech $700M) that the broader market had not yet
            priced in. Communication Services insiders likely acted on the recognition that Alphabet, Meta, and Netflix
            were generating 21% average EPS growth and maturing into cash-generative businesses — trading at valuations
            that didn't yet reflect their earnings power.
          </li>
          <li style={{ marginBottom: "0" }}>
            <strong>Consumer Staples &amp; Industrials · Nov 2 – Dec 7, 2025.</strong> Consumer Staples had lagged
            the broader market sharply (3.9% YTD) under sustained tariff-driven input cost pressure. With Q3 blackout
            windows lifting and S&amp;P 500 EPS growth coming in at 14% — the fourth consecutive quarter of
            double-digit expansion — insiders in Consumer Staples — consistent with the well-documented pattern that insiders tend to buy
            after prices fall — likely viewed the sector's underperformance as overdone relative to the broader
            earnings environment and bought into the disconnect. Industrials insiders,
            coming off 18.3% YTD returns fueled by domestic reshoring, likely used the post-blackout window to add
            exposure ahead of what they anticipated would be continued manufacturing momentum.
          </li>
        </ul>
      </section>

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
          <strong>Alternatives considered.</strong> An early design used a{" "}
          <span style={{ position: "relative", display: "inline-block" }}
            onMouseEnter={(e) => {
              const el = e.currentTarget.querySelector<HTMLDivElement>(".design-preview")!;
              el.style.display = "block";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget.querySelector<HTMLDivElement>(".design-preview")!;
              el.style.display = "none";
            }}
          >
            <span style={{ borderBottom: "2px dotted #888", cursor: "default", color: "#111", fontWeight: 500 }}>
              half-monthly aggregated heatmap
            </span>
            <div className="design-preview" style={{
              display: "none",
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 50,
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              borderRadius: "6px",
              overflow: "hidden",
              border: "1px solid #e5e5e5",
              width: "480px",
            }}>
              <img src={`${import.meta.env.BASE_URL}initial_design.jpg`} alt="Initial heatmap design" style={{ width: "100%", display: "block" }} />
            </div>
          </span>{" "}
          binned into ~24 periods per year.
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
          <li style={{ marginBottom: "0.4rem" }}>U.S. Securities and Exchange Commission. <em>Rule 10b5-1 and Insider Trading Policies and Procedures</em> (Release No. 33-11138, Dec. 14, 2022). <a href="https://www.sec.gov/files/33-11138-fact-sheet.pdf" target="_blank" rel="noreferrer" style={{ color: "#1a56db" }}>sec.gov</a>.</li>
          <li style={{ marginBottom: "0.4rem" }}>Jeng, L. A. "Estimating the Returns to Insider Trading: A Performance-Evaluation Perspective." <em>The Review of Economics and Statistics</em>, vol. 85, no. 2, May 2003, pp. 453–471.</li>
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
          (axis setup, brush configuration, scale definitions) and to debug React/D3 integration issues. It also supported
          rapid prototyping and ideation: early design alternatives (stacked bar charts, monthly binning, global vs. per-sector
          color scales) were sketched and evaluated quickly with AI assistance, compressing the iteration cycle. All visualization
          design decisions, data modeling choices, and analytical framing were made by the author.
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
