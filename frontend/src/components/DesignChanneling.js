import axios from "axios";

export async function DesignChanneling() {
  try {
    const prompt =
      "丁寧な日本語で返答しなければならない状況を1つ作成してください。状況説明のみを簡潔に出力してください。例文や返答例は不要です。冒頭の挨拶や確認の言葉は省略し、すぐに状況の説明から始めてください。";
    const response = await axios.post(
      "http://localhost:8080/api/generate-japanese-question",
      prompt,
      { headers: { "Content-Type": "text/plain" } }
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
}
