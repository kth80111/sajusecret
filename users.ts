// pages/admin.tsx

"use client";

import { useState } from "react";

export default function AdminPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (id === "kth8011" && pw === "rlaxogh8011!") {
      const res = await fetch("/api/users");
      const json = await res.json();
      setData(json);
    } else {
      setError("ID 또는 Password가 틀렸습니다.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">🔐 관리자 로그인</h1>
      <input className="border p-2 w-full" placeholder="ID" onChange={e => setId(e.target.value)} />
      <input className="border p-2 w-full mt-2" placeholder="Password" type="password" onChange={e => setPw(e.target.value)} />
      <button onClick={handleLogin} className="mt-4 bg-black text-white px-4 py-2">로그인</button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {data.length > 0 && (
        <table className="mt-6 table-auto w-full text-sm">
          <thead><tr><th>이름</th><th>연락처</th><th>이메일</th><th>질문</th></tr></thead>
          <tbody>
            {data.map((u, i) => (
              <tr key={i}><td>{u.name}</td><td>{u.phone}</td><td>{u.email}</td><td>{u.user_question}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
