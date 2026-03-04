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
    <div className="max-w-[1100px] mx-auto px-4 pt-2">
      <SentimentChart buys={buys} sells={sells} loading={loading} />
    </div>
  );
}

export default App;
