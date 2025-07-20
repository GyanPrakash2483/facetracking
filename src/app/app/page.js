'use client'

import { Button, Switch } from '@mui/material'
import * as faceapi from 'face-api.js'
import { useEffect, useState, useRef } from 'react'

const loadFaceDetectionModels = async () => {
  await faceapi.loadAgeGenderModel('/models')
  await faceapi.loadFaceExpressionModel('/models')
  await faceapi.loadFaceLandmarkModel('/models')
  await faceapi.loadSsdMobilenetv1Model('/models')
}

const streamUserVideo = async (landmarkEnabledRef, expressionEnabledRef) => {

  const liveVideoFeed = document.querySelector('#live-video-feed')
  const liveVideoFeedContext = liveVideoFeed.getContext('2d')

  const userVideoStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  })

  const video = document.createElement('video')
  video.autoplay = true
  video.playsInline = true

  video.srcObject = userVideoStream

  video.addEventListener('loadedmetadata', () => {
    liveVideoFeed.width = 480
    liveVideoFeed.height = 340
    video.play()
    drawVideoFrame()

  })

  let resizedDetections = []
  let detectionResults = []

  const drawVideoFrame = async () => {

    const expressionEnabled = expressionEnabledRef.current
    const landmarkEnabled = landmarkEnabledRef.current

    liveVideoFeedContext.drawImage(video, 0, 0, liveVideoFeed.width, liveVideoFeed.height)

    // console.log(landmarkEnabled, expressionEnabled)

    try {
      faceapi.draw.drawDetections(liveVideoFeed, resizedDetections)

      // Face Expression and Face Landmarks are additional features not specified in provided doc
      if(expressionEnabled) {
        faceapi.draw.drawFaceExpressions(liveVideoFeed, resizedDetections)
      }
      if(landmarkEnabled) {
        faceapi.draw.drawFaceLandmarks(liveVideoFeed, resizedDetections, { drawLines: true })
      }
    } catch(err) {
      console.log(err.message)
      // Error possibly due to mismatch between available and expected data due to configuration change between frames
      // Will be fixed in next frame, hence ignored
    }

    if (!landmarkEnabled && !expressionEnabled) {
      detectionResults = await faceapi.detectAllFaces(video)
    } else if (landmarkEnabled && !expressionEnabled) {
      detectionResults = await faceapi.detectAllFaces(video).withFaceLandmarks()
    } else if (!landmarkEnabled && expressionEnabled) {
      detectionResults = await faceapi.detectAllFaces(video).withFaceExpressions()
    } else {
      detectionResults = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceExpressions()
    }

    if(detectionResults.length) {
      resizedDetections = faceapi.resizeResults(detectionResults, {
        width: liveVideoFeed.width,
        height: liveVideoFeed.height
      })
    }

    requestAnimationFrame(drawVideoFrame)
  }

}

// A better way will be to use `useRef` and keep this inside the component, however this approach is because of the deadline

let global_media_recorder
let chunks = []

const startRecording = () => {
  const startRecordingButton = document.querySelector('#start-recording-button')
  const stopRecordingButton = document.querySelector('#stop-recording-button')

  startRecordingButton.hidden = true
  stopRecordingButton.hidden = false

  const canvas = document.querySelector('#live-video-feed')
  const stream = canvas.captureStream()

  const mediaRecorder = new MediaRecorder(stream)

  mediaRecorder.start()

  mediaRecorder.addEventListener('dataavailable', (e) => {
    chunks.push(e.data)
  })

  const recordedVideoContainer = document.querySelector('#recorded-video-container')
  const recordedVideoEl = document.querySelector('#recorded-video')

  mediaRecorder.addEventListener('stop', (e) => {
    const blob = new Blob(chunks)
    chunks = []
    const videoURL = URL.createObjectURL(blob)
    recordedVideoEl.src = videoURL

    recordedVideoContainer.hidden = false
  })

  global_media_recorder = mediaRecorder

}

const stopRecording = () => {
  const startRecordingButton = document.querySelector('#start-recording-button')
  const stopRecordingButton = document.querySelector('#stop-recording-button')

  startRecordingButton.hidden = false
  stopRecordingButton.hidden = true

  global_media_recorder.stop()


}

// Download Video
const saveVideoToDisk = () => {
  const recordedVideoEl = document.querySelector('#recorded-video')
  const url = recordedVideoEl.src

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'face-tracked-video.mp4'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob); // returns base64 data URL
  });
}

const saveVideoToLocalStorage = async (e) => {
  const recordedVideoEl = document.querySelector('#recorded-video')
  const videoContent = await fetch(recordedVideoEl.src)
  const videoContentBlob = await videoContent.blob()
  const base64EncodedVideo =  await blobToBase64(videoContentBlob)

  localStorage.setItem('recording', base64EncodedVideo)

  const prevText = e.target.innerText

  e.target.innerText = 'Saved'
  e.target.enabled = false

  setTimeout(() => {
    e.target.innerText = prevText
    e.target.enabled = true
  }, 2000)

}

const loadPreviousVideoIfAvailable = () => {

  const savedVideoBase64 = localStorage.getItem('recording')
  if(!savedVideoBase64) {
    return
  }

  const recordedVideoEl = document.querySelector('#recorded-video')
  const recordedVideoContainer = document.querySelector('#recorded-video-container')

  recordedVideoEl.src = savedVideoBase64 // Base64 URL format (Video is encoded in the URL in base64 format)
  recordedVideoContainer.hidden = false

}


export default function App() {

  const [landmarkEnabled, setLandmarkEnabled] = useState(false)
  const [expressionEnabled, setExpressionEnabled] = useState(false)

  const landmarkEnabledRef = useRef(landmarkEnabled)
  const expressionEnabledRef = useRef(expressionEnabled)

  useEffect(() => {
    landmarkEnabledRef.current = landmarkEnabled
  }, [landmarkEnabled])

  useEffect(() => {
    expressionEnabledRef.current = expressionEnabled
  }, [expressionEnabled])

  useEffect(() => {
    const loadModels = async () => {
      loadPreviousVideoIfAvailable()
      await loadFaceDetectionModels()
      // console.log("Replay")
      await streamUserVideo(landmarkEnabledRef, expressionEnabledRef)
    }
    loadModels()
  }, [])

  return (
    <div className='max-w-[480px] mx-auto mt-2'>

      <canvas id="live-video-feed"></canvas>
      <div className='options-container w-full p-2'>
        <h2 className='text-xl'> Options </h2>
        <Switch aria-label='Face Landmark' checked={landmarkEnabled} onChange={(e) => setLandmarkEnabled(Boolean(e.target.checked))} /> Face Landmark<br />
        <Switch aria-label='Face Expression' checked={expressionEnabled} onChange={(e) => setExpressionEnabled(Boolean(e.target.checked))} /> Face Expression
      </div>
      <div className="w-full p-2 flex justify-center">
        <Button variant="contained" onClick={startRecording} id="start-recording-button"> Start Recording </Button>
        <Button variant="outlined" hidden onClick={stopRecording} id="stop-recording-button"> Stop Recording </Button>
      </div>

      <div id="recorded-video-container" className='flex flex-col gap-2' hidden={true}>
        <h2 className='text-xl'>Recording</h2>
        <video controls={true} id="recorded-video"></video>
        <div className='flex flex-col gap-2'>
        {/** Saving to disk (downloading) is an additional Feature */}
          <Button variant='contained' onClick={saveVideoToDisk}> Save to Disk </Button>
          <Button variant='contained' onClick={saveVideoToLocalStorage}> Save to localStorage </Button> {/** A better approach could be to use IndexedDB as it provides much larger storage space, however the doc specifically mentions localStorage */}
          <Button variant='outlined' onClick={() => {
            localStorage.removeItem('recording')
            window.location.reload()
          }}> Clear localStorage </Button> {/** A better approach could be to use IndexedDB as it provides much larger storage space, however the doc specifically mentions localStorage */}
        </div>
      </div>

    </div>
  );
}
