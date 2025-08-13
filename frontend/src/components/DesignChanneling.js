// You can place this below your App component or in a separate file
import React, { useState } from "react";
import axios from "axios";

function DesignChanneling() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const askGemini = async () => {
    setLoading(true);
    try {
      // The prompt can be customized or hardcoded as needed
      const prompt =
        "丁寧な日本語で返答しなければならない状況を1つ作成してください。状況説明のみを簡潔に出力してください。例文や返答例は不要です。冒頭の挨拶や確認の言葉は省略し、すぐに状況の説明から始めてください。";
      const response = await axios.post(
        "http://localhost:8080/api/generate-japanese-question",
        prompt,
        { headers: { "Content-Type": "text/plain" } }
      );
      setQuestion(response.data);
    } catch (error) {
      setQuestion("エラーが発生しました。");
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={askGemini} disabled={loading}>
        {loading ? "質問中..." : "日本語の質問を出す"}
      </button>
      {question && (
        <div style={{ marginTop: "1em" }}>
          <strong>Geminiの質問:</strong>
          <div>{question}</div>
        </div>
      )}
    </div>
  );
}

export default DesignChanneling;
