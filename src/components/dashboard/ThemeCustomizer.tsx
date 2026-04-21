'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Moon, Sun, Type, Layers } from 'lucide-react'

interface ThemeCustomizerProps {
  initialSettings: any
  onSettingsChange: (settings: any) => void
}

export default function ThemeCustomizer({ initialSettings, onSettingsChange }: ThemeCustomizerProps) {
  const [settings, setSettings] = useState(initialSettings || {
    theme: 'light',
    font: 'sans',
    glassOpacity: 0.5,
    backgroundImage: ''
  })

  const handleChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onSettingsChange(newSettings)
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0 space-y-6">
        {/* 테마 선택 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">테마 모드</Label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={settings.theme === 'light' ? 'default' : 'outline'}
              className="w-full justify-start gap-2"
              onClick={() => handleChange('theme', 'light')}
            >
              <Sun className="h-4 w-4" /> 라이트
            </Button>
            <Button
              type="button"
              variant={settings.theme === 'dark' ? 'default' : 'outline'}
              className="w-full justify-start gap-2"
              onClick={() => handleChange('theme', 'dark')}
            >
              <Moon className="h-4 w-4" /> 다크
            </Button>
          </div>
        </div>

        {/* 폰트 선택 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">폰트 스타일</Label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={settings.font === 'sans' ? 'default' : 'outline'}
              className="w-full justify-start gap-2 font-sans"
              onClick={() => handleChange('font', 'sans')}
            >
              <Type className="h-4 w-4" /> 고딕 (Sans)
            </Button>
            <Button
              type="button"
              variant={settings.font === 'serif' ? 'default' : 'outline'}
              className="w-full justify-start gap-2 font-serif"
              onClick={() => handleChange('font', 'serif')}
            >
              <Type className="h-4 w-4" /> 명조 (Serif)
            </Button>
          </div>
        </div>

        {/* 유리창 투명도 */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-sm font-medium">유리창 투명도 (Glassmorphism)</Label>
            <span className="text-xs text-muted-foreground">{Math.round(settings.glassOpacity * 100)}%</span>
          </div>
          <div className="flex items-center gap-4">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              value={settings.glassOpacity}
              onChange={(e) => handleChange('glassOpacity', parseFloat(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* 배경 이미지 URL */}
        <div className="space-y-3">
          <Label className="text-sm font-medium" htmlFor="bg-image">배경 이미지 URL</Label>
          <Input
            id="bg-image"
            placeholder="https://example.com/image.jpg"
            value={settings.backgroundImage}
            onChange={(e) => handleChange('backgroundImage', e.target.value)}
          />
          <p className="text-[10px] text-muted-foreground italic">Unsplash 등 외부 이미지 링크를 사용할 수 있습니다.</p>
        </div>

        {/* hidden inputs for form submission */}
        <input type="hidden" name="theme" value={settings.theme} />
        <input type="hidden" name="font" value={settings.font} />
        <input type="hidden" name="glassOpacity" value={settings.glassOpacity} />
        <input type="hidden" name="backgroundImage" value={settings.backgroundImage} />
      </CardContent>
    </Card>
  )
}
