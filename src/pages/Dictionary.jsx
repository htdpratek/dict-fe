import { useState } from "react";

export default function Dictionary() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("av");

  const API = "https://dict-server-oxek.onrender.com";

  const searchWord = async () => {
    if (!word) return;

    setResult(null);

    try {
      const res = await fetch(`${API}/api/${mode}/${word}`);
      const data = await res.json();

      if (data.error) {
        alert("Không tìm thấy từ 🥲");
        return;
      }

      // ✅ QUAN TRỌNG: Lưu result để hiển thị
      setResult(data);

    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối server");
    }
  };

  return (
    <div>
      <div className="bg-layer"></div>
      <div className="blur-layer"></div>

      <h2 className="dict-title">📘 DICTIONARY - TỪ ĐIỂN 📘</h2>

      {/* ✅ MODE SWITCH */}
      <div className="mode-switch">
        <button
          className={mode === "av" ? "active" : ""}
          onClick={() => setMode("av")}
        >
          EN → VI
        </button>

        <button
          className={mode === "va" ? "active" : ""}
          onClick={() => setMode("va")}
        >
          VI → EN
        </button>
      </div>

      {/* ✅ SEARCH */}
      <div className="search-box">
        <input
          type="text"
          placeholder={
            mode === "av"
              ? "Enter English word..."
              : "Nhập từ tiếng Việt..."
          }
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <button onClick={searchWord}>Tra cứu</button>
      </div>

      {/* ✅ RESULT TABLE */}
      {result && (
        <table className="dict-table">
          <thead>
            <tr>
              <th>Từ</th>
              <th>Phiên âm</th>
              <th>Nghĩa</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{result.word}</td>
              <td>{result.pronounce || "-"}</td>
              <td>
                <ul className="defs-list">
                  {result.defs?.map((d, i) => {
                    // Nếu không bắt đầu bằng "=" → mục lớn
                    if (!d.startsWith("=")) {
                      return (
                        <li key={i} className="def-title">
                          {d}
                        </li>
                      );
                    }

                    // Nếu bắt đầu bằng "=" → tách nội dung
                    const text = d.substring(1).split("+"); // bỏ "=" rồi split

                    return (
                      <li key={i} className="def-item">
                        {text.map((t, j) => (
                          <div key={j}>• {t}</div>
                        ))}
                      </li>
                    );
                  })}
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
