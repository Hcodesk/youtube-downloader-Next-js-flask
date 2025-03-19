"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { AlertCircle, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function VideoDownloader() {
  const [videoUrl, setVideoUrl] = useState("") // State to store the video URL
  const [format, setFormat] = useState("mp4") // State to store the selected format
  const [thumbnailUrl, setThumbnailUrl] = useState("") // State to store the thumbnail URL
  const [progress, setProgress] = useState(0) // State to store the download progress
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Function to validate URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  // Function to fetch thumbnail (simplified for demo)
  useEffect(() => {
    if (videoUrl && isValidUrl(videoUrl)) {
      // In a real app, you would fetch the actual thumbnail from an API
      // This is a simplified example that just uses a placeholder
      setThumbnailUrl(`/placeholder.svg?height=180&width=320`)
      setError("")
    } else if (videoUrl) {
      setThumbnailUrl("")
      setError("Please enter a valid URL")
    } else {
      setThumbnailUrl("")
      setError("")
    }
  }, [videoUrl])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!videoUrl) {
      setError("Please enter a video URL")
      return
    }

    if (!isValidUrl(videoUrl)) {
      setError("Please enter a valid URL")
      return
    }

    setError("")
    setIsDownloading(true)
    setProgress(0)
    setSuccess(false)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 10
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return newProgress
        })
      }, 500)

      // Make the actual API request
      const response = await fetch("http://127.0.0.1:5328/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_url: videoUrl,
          format: format,
        }),
      })

      // Clear the interval when the request completes
      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Download failed")
      }

      // Handle successful download
      setSuccess(true)
      setTimeout(() => {
        setIsDownloading(false)
      }, 1000)
    } catch (err) {
      setProgress(0)
      setIsDownloading(false)
      setError(err instanceof Error ? err.message : "Download failed. Please try again.")
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="video-url">Video URL</Label>
            <Input
              id="video-url"
              type="text"
              placeholder="https://example.com/video"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              disabled={isDownloading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Download Format</Label>
            <Select value={format} onValueChange={setFormat} disabled={isDownloading}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp4">MP4</SelectItem>
                <SelectItem value="mp3">MP3</SelectItem>
                <SelectItem value="webm">WebM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {thumbnailUrl && (
            <div className="space-y-2">
              <Label>Video Thumbnail</Label>
              <div className="relative rounded-md overflow-hidden w-full h-[180px]">
                <Image src={thumbnailUrl || "/placeholder.svg"} alt="Video thumbnail" fill className="object-cover" />
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4" />
              <AlertDescription>Download completed successfully!</AlertDescription>
            </Alert>
          )}

          {isDownloading && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Downloading...</Label>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isDownloading || !videoUrl}>
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

