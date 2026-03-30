"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Settings,
  Download,
  Loader2,
  Music4,
  AlertCircle,
  FileAudio,
} from "lucide-react"
import Setting from "./setting"
import { FormatOptions, Styles, VoiceOptions } from "./config"
import { useMimoTTS } from "@/hooks/useMimoTTS"
import { download } from "@/utils"
import { ButtonGroup } from "@/components/ui/button-group"
import { Separator } from "@/components/ui/separator"

export default function TTSApp() {
  const [text, setText] = useState(
    "哎呀妈呀，这天儿也忒冷了吧！你说这风，嗖嗖的，跟刀子似的，割脸啊！",
  )
  const [voice, setVoice] = useState("mimo_default")
  const [format, setFormat] = useState("mp3")
  const [styles, setStyles] = useState<Record<string, string>>({
    emotion: "开心",
  })

  const computeStyles = useMemo(() => {
    return Object.values(styles).filter(Boolean)
  }, [styles])

  const styledText = useMemo(() => {
    if (computeStyles.length === 0) return text
    if (text.includes("<style>")) return text
    return `<style>${computeStyles.join(", ")}</style>${text}`
  }, [text, styles])

  // Settings State
  const [apiKey, setApiKey] = useState("")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const { generate, loading, error, audio } = useMimoTTS(apiKey)

  useEffect(() => {
    // Load API key from local storage on mount
    const savedKey = localStorage.getItem("MIMO_API_KEY")
    if (savedKey) {
      setApiKey(savedKey)
    }
  }, [])

  function saveConfig(key: string) {
    setApiKey(key)
    localStorage.setItem("MIMO_API_KEY", key)
    setIsSettingsOpen(false)
  }

  function toggleStyle(type: string, style: string) {
    setStyles(prev => ({
      ...prev,
      [type]: prev[type] === style ? "" : style,
    }))
  }

  function onGenerate() {
    if (!apiKey) {
      setIsSettingsOpen(true)
      return
    }
  }

  function onDownload() {
    if (!audio) return
    download(audio, `synthesized_audio.${format === "pcm16" ? "pcm" : format}`)
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center font-sans px-4">
      {/* Settings Action */}
      <div className="flex justify-between w-full max-w-5xl py-4">
        <div className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
          MIMO V2 TTS
        </div>
        <Button
          variant="outline"
          className="text-neutral-400 hover:text-white hover:bg-neutral-800"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="h-5 w-5" />
          设置
        </Button>
      </div>
      <div className="w-full my-auto max-w-5xl self-center grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        {/* Left Panel: Configuration */}
        <Card className="bg-neutral-900 border-neutral-800 shadow-2xl flex flex-col h-full">
          <CardContent className="space-y-6 flex-1">
            <Textarea
              placeholder="Type something amazing..."
              className="resize-none h-60 bg-neutral-950 border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-neutral-200"
              value={text}
              onChange={e => setText(e.target.value)}
            />

            <div className="space-y-3">
              <div className="flex gap-4">
                <Label className="text-neutral-300 font-medium text-sm">
                  音色
                </Label>
                <ButtonGroup>
                  {VoiceOptions.map(option => (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={voice === option.value ? "default" : "outline"}
                      onClick={() => setVoice(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </div>

              <div className="flex gap-4">
                <Label className="text-neutral-300 font-medium text-sm">
                  格式
                </Label>
                <ButtonGroup>
                  {FormatOptions.map(option => (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={format === option.value ? "default" : "outline"}
                      onClick={() => setFormat(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center">
                风格控制
                <span className="text-xs text-neutral-500 ml-auto">
                  也可以在文本中输入style标签，例如：&lt;style&gt;开心,
                  悲伤&lt;/style&gt;文本内容
                </span>
              </div>
              {Styles.map(style => (
                <div key={style.label} className="flex gap-4">
                  <Label className="text-neutral-300 font-medium text-sm">
                    {style.label}
                  </Label>
                  <ButtonGroup>
                    {style.options.map(option => (
                      <Button
                        key={option}
                        size="sm"
                        variant={
                          styles[style.type] === option ? "default" : "outline"
                        }
                        onClick={() => toggleStyle(style.type, option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </ButtonGroup>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-6 border-t border-neutral-800">
            <Button
              className="w-full  h-12 font-medium text-base py-6"
              onClick={onGenerate}
              disabled={loading || !text.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  生成中...
                </>
              ) : (
                "生成语音"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Right Panel: Output */}
        <div className="flex flex-col">
          <Card className="bg-neutral-900 border-neutral-800 shadow-2xl flex-1 flex flex-col justify-center overflow-hidden relative min-h-[480px]">
            {/* Ambient Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/10 to-indigo-900/10 pointer-events-none" />

            <CardContent className="p-8 flex flex-col items-center justify-center flex-1 h-full z-10 w-full relative">
              {!audio && !loading && !error && (
                <div className="text-center text-neutral-500 flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center mb-6">
                    <Music4 className="h-10 w-10 text-neutral-600 opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-300">
                    Awaiting Input
                  </h3>
                  <p className="mt-2 text-sm max-w-xs text-neutral-400">
                    Your generated speech will appear here once the synthesis is
                    complete.
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center space-y-8 w-full">
                  <div className="flex gap-2 items-center justify-center h-24 w-full">
                    {[0, 1, 2, 3, 4, 5, 6].map(i => (
                      <div
                        key={i}
                        className="w-2.5 bg-indigo-500/80 rounded-full animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                        style={{
                          height: `${Math.max(30, Math.random() * 100)}%`,
                          animationDelay: `${i * 120}ms`,
                          animationDuration: "800ms",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-indigo-400 animate-pulse tracking-wide uppercase">
                    Connecting to MiMo-V2...
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-5 w-full max-w-sm mx-auto flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-red-400 font-medium text-sm mb-1">
                      Synthesis Failed
                    </h4>
                    <p className="text-red-400/80 text-sm leading-relaxed max-w-full break-words">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {audio && !loading && (
                <div className="w-full flex justify-center flex-col items-center py-6 space-y-10 animate-in fade-in zoom-in duration-700 delay-100 fill-mode-both relative">
                  {/* Subtle success glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />

                  <div className="h-32 w-32 rounded-full border border-neutral-700/50 bg-neutral-950 flex items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.15)] ring-1 ring-white/5">
                    <FileAudio className="h-12 w-12 text-indigo-400" />
                  </div>

                  <div className="w-full max-w-sm flex flex-col gap-6 relative z-10">
                    <audio
                      controls
                      src={audio}
                      className="w-full h-12 rounded-full outline-none [&::-webkit-media-controls-panel]:bg-neutral-800"
                      autoPlay
                    />

                    <Button
                      variant="outline"
                      className="w-full border-neutral-700 bg-neutral-950/50 backdrop-blur text-neutral-200 hover:bg-white hover:text-black transition-all hover:scale-[1.02] active:scale-[0.98] h-12"
                      onClick={onDownload}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Audio File
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Setting
        visible={isSettingsOpen}
        apiKey={apiKey}
        onClose={() => setIsSettingsOpen(false)}
        onSave={saveConfig}
      />
    </div>
  )
}
