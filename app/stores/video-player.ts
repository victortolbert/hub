import { useMediaControls } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useVideoPlayer = defineStore('video', () => {
  // we won't expose (return) this element directly
  const videoElement = ref<HTMLVideoElement>()
  const src = ref('/data/video.mp4')
  const { playing, volume, currentTime, togglePictureInPicture }
    = useMediaControls(videoElement, { src })

  function loadVideo(element: HTMLVideoElement, src: string) {
    videoElement.value = element
    src.value = src
  }

  return {
    src,
    playing,
    volume,
    currentTime,

    loadVideo,
    togglePictureInPicture,
  }
})
