import { onBeforeUnmount, ref } from 'vue'

/**
 * 카메라 미리보기 + 사전 점검 (PC05)
 * - getUserMedia 는 HTTPS 또는 localhost 에서만 동작해요.
 * - 프레임은 브라우저 안에서 밝기만 계산하고 어디에도 보내지 않아요.
 * - 얼굴 검출(MediaPipe)은 AI 파트 연결 후 여기에 추가해요.
 */
export function useCamera() {
  const videoEl = ref(null)
  const status = ref('idle') // idle | requesting | granted | denied | unsupported
  const devices = ref([])
  const deviceId = ref('')
  const brightness = ref(null) // 0~255, 화면 평균 밝기

  let stream = null
  let timer = null
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 24
  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  function measureBrightness() {
    const video = videoEl.value
    if (!video || video.readyState < 2) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let sum = 0
    for (let i = 0; i < data.length; i += 4) {
      sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    }
    brightness.value = Math.round(sum / (data.length / 4))
  }

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia) {
      status.value = 'unsupported'
      return
    }
    stop()
    status.value = 'requesting'
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId.value ? { deviceId: { exact: deviceId.value } } : true,
        audio: false,
      })
      status.value = 'granted'
      if (videoEl.value) videoEl.value.srcObject = stream

      const all = await navigator.mediaDevices.enumerateDevices()
      devices.value = all.filter((d) => d.kind === 'videoinput')
      deviceId.value = stream.getVideoTracks()[0]?.getSettings().deviceId ?? ''

      timer = setInterval(measureBrightness, 1000)
    } catch {
      status.value = 'denied'
    }
  }

  function stop() {
    clearInterval(timer)
    timer = null
    stream?.getTracks().forEach((track) => track.stop())
    stream = null
    brightness.value = null
    if (status.value !== 'denied' && status.value !== 'unsupported') status.value = 'idle'
  }

  async function switchDevice(id) {
    deviceId.value = id
    await start()
  }

  onBeforeUnmount(stop)

  return { videoEl, status, devices, deviceId, brightness, start, stop, switchDevice }
}
