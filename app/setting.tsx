import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpRightIcon } from "lucide-react"
import { useEffect, useState } from "react"

interface Props {
  visible: boolean
  apiKey: string
  onClose: () => void
  onSave: (apiKey: string) => void
}

export default function Setting(props: Props) {
  const { visible, apiKey, onClose, onSave } = props
  const [key, setKey] = useState(apiKey)

  useEffect(() => {
    setKey(apiKey)
  }, [apiKey])

  return (
    <Dialog
      open={visible}
      onOpenChange={open => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">设置</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="apiKey" className="text-neutral-300">
                Xiaomi MiMo API Key:
              </Label>
              <a
                className="ml-auto flex items-center gap-1"
                href="https://platform.xiaomimimo.com/#/console/api-keys"
                target="_blank"
              >
                获取
                <ArrowUpRightIcon className="size-3" />
              </a>
            </div>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={key}
              onChange={e => setKey(e.target.value)}
              className="bg-neutral-950 border-neutral-800 text-neutral-200 focus-visible:ring-indigo-500"
            />
            <p className="text-xs text-neutral-500">
              Your API key is never sent to our servers. It is stored securely
              in your browser's local storage.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onClose()}
            className="border-neutral-700 bg-transparent hover:bg-neutral-800 text-neutral-300"
          >
            取消
          </Button>
          <Button
            onClick={() => onSave(key)}
            className="bg-white text-black hover:bg-neutral-200"
          >
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
