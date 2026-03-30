import { useState } from "react"

const API_URL = "https://api.xiaomimimo.com/v1/chat/completions"
export function useMimoTTS(apiKey: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audio, setAudio] = useState<string | null>(null)

  async function generate(text: string, voice: string, format: string) {
    setLoading(true)
    setError(null)
    setAudio(null)
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          model: "mimo-v2-tts",
          messages: [{ role: "assistant", content: text }],
          audio: { format, voice },
          stream: false,
        }),
      })
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
      }
      const data = await response.json()
      const base64Audio = data.choices?.[0]?.message?.audio?.data
      if (base64Audio) {
        let mimeType = "audio/mpeg"
        if (format === "wav") mimeType = "audio/wav"
        if (format === "pcm16") mimeType = "audio/l16"
        setAudio(`data:${mimeType};base64,${base64Audio}`)
      } else {
        throw new Error("Could not find base64 audio data in the response")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { generate, loading, error, audio }
}
