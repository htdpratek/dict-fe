import { useEffect, useMemo, useState } from "react";

export default function Flashcard() {
  const API = "https://dict-server-oxek.onrender.com";

  // av = Anh→Việt, va = Việt→Anh
  const [mode, setMode] = useState("av");

  // dữ liệu thẻ
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // lịch sử ngày
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // trạng thái
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // card hiện tại
  const card = useMemo(() => cards[index] ?? null, [cards, index]);

  // ------- API calls -------

  async function loadToday() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${API}/api/daily/${mode}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid daily response");
      setCards(data);
      setIndex(0);
      setFlipped(false);
      setSelectedDate(null);
    } catch (e) {
      setErr("Không tải được danh sách thẻ hôm nay.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadDates() {
    setErr("");
    try {
      const res = await fetch(`${API}/api/dates/${mode}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid dates response");
      // đảo ngược để ngày mới nhất trước
      setDates([...data].reverse());
    } catch (e) {
      console.error(e);
    }
  }

  async function loadByDate(d) {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${API}/api/words/${mode}/${d}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid words-by-date response");
      setCards(data);
      setIndex(0);
      setFlipped(false);
      setSelectedDate(d);
    } catch (e) {
      setErr("Không tải được thẻ theo ngày đã chọn.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // đổi mode → nạp lại
  useEffect(() => {
    loadToday();
    loadDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // phím tắt: ←/→, Space lật thẻ
  useEffect(() => {
    function onKey(e) {
      if (e.code === "ArrowLeft") prev();
      if (e.code === "ArrowRight") next();
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((s) => !s);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, cards.length]);

  // ------- actions -------

  function prev() {
    if (index > 0) {
      setIndex((i) => i - 1);
      setFlipped(false);
    }
  }

  function next() {
    if (index < cards.length - 1) {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  }

  function shuffle() {
    if (!cards.length) return;
    const arr = [...cards];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setCards(arr);
    setIndex(0);
    setFlipped(false);
  }

  return (
    <div>
      <div className="bg-layer"></div>
      <div className="blur-layer"></div>
      {/* tiêu đề + mode */}
      <div >
        <h2 className="fc-title">🎴 FLASHCARD 🎴</h2>

        <div className="mode-switch">
          <button
            className={mode === "av" ? "active" : ""}
            onClick={() => setMode("av")}
            title="English → Vietnamese"
          >
            EN → VI
          </button>
          <button
            className={mode === "va" ? "active" : ""}
            onClick={() => setMode("va")}
            title="Vietnamese → English"
          >
            VI → EN
          </button>
        </div>
      </div>

      {/* thanh công cụ */}
      <div className="fc-toolbar">
        <button onClick={loadToday}>Lấy từ vựng</button>
        <button onClick={shuffle}>Xáo trộn</button>
        <div className="fc-progress">
          {cards.length ? (
            <>
              {index + 1}/{cards.length}
            </>
          ) : (
            "0/0"
          )}
        </div>
      </div>

     {/* khu vực thẻ */}
      <div className="fc-stage">
        {loading && <div className="fc-empty">Đang tải…</div>}
        {!loading && err && <div className="fc-error">{err}</div>}

        {!loading && !err && !card && (
          <div className="fc-empty">Không có thẻ để học.</div>
        )}

        {!loading && !err && card && (
          <div
            className={`fc-card ${flipped ? "flipped" : ""}`}
            onClick={() => setFlipped((s) => !s)}
            title="Nhấp để lật thẻ (Space)"
          >
            {/* Mặt trước: chỉ từ */}
            <div className="fc-face fc-front">
              <div className="fc-word">{card.word}</div>
            </div>

            {/* Mặt sau: defs */}
            <div className="fc-face fc-back">
              <div className="fc-meaning">
                <DefsBlock defs={card.defs} />
              </div>
            </div>
          </div>
        )}

        {/* điều hướng */}
        <div className="fc-nav">
          <button onClick={prev} disabled={index === 0}>
            ◀ Trước
          </button>
          <button onClick={next} disabled={index >= cards.length - 1}>
            Sau ▶
          </button>
        </div>
      </div>


      {/* lịch sử ngày */}
      <div className="fc-history">
        <div className="fc-history-head">
          <h3>📅 Ngày đã học</h3>
          {selectedDate && (
            <button className="fc-clear" onClick={loadToday}>
              Trở về hôm nay
            </button>
          )}
        </div>
        <div className="fc-date-list">
          {dates.map((d) => (
            <button
              key={d}
              className={`fc-date ${selectedDate === d ? "active" : ""}`}
              onClick={() => loadByDate(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Quy tắc:
 *  - Bắt đầu bằng "*": tiêu đề/nhóm (bỏ "*")
 *  - Bắt đầu bằng "=": bỏ "=" rồi split theo "+" → mỗi phần 1 dòng
 *  - Còn lại: nếu có "//" thì split "//"; nếu có "+" thì split "+";
 *             nếu không có gì thì một dòng
 */
function DefsBlock({ defs }) {
  if (!Array.isArray(defs) || defs.length === 0) return <div>-</div>;

  const trimMark = (s) => s.replace(/^[*=]+/, "").trim();

  return (
    <div className="defs">
      {defs.map((d, i) => {
        if (typeof d !== "string") return null;

        // Tiêu đề nhóm
        if (d.startsWith("*")) {
          return (
            <div className="def-title" key={i}>
              {trimMark(d)}
            </div>
          );
        }

        // Dòng list
        let parts;
        if (d.startsWith("=")) {
          parts = trimMark(d).split("+");
        } else if (d.includes("//")) {
          parts = d.split("//");
        } else if (d.includes("+")) {
          parts = d.split("+");
        } else {
          parts = [d];
        }

        return (
          <ul className="def-items" key={i}>
            {parts.map((p, j) => (
              <li key={j}>• {p.trim()}</li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}
