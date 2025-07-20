'use client'

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter()

  return (
    <div className='flex flex-col items-center p-2'>
      <h1 className="text-3xl mt-8 mb-2 ml-1">Face Tracking Application</h1>
      <div className='flex justify-around gap-12 p-12 max-md:flex-col'>
        <div className='p-12'>
          Created By: Gyan Prakash <br />
          Contact: <a href="mailto:gyanprakash2483@gmail.com" className="text-blue-600 underline"> gyanprakash2483@gmail.com </a>
        </div>
        <div className='p-12'>
          <Button variant="contained" onClick={() => { router.push('/app') }}> Open Face Tracker </Button>
        </div>
      </div>
      <div>
        <h2 className='text-2xl mt-3 mb-2 ml-1'> Project Overview </h2>
        <p>
          The application is a React-based face tracking and video recording tool that:
        </p>
        <ul className="list-disc list-inside">
          <li>Uses <code>face-api.js</code> to detect faces, facial landmarks, and facial expressions.</li>
          <li>Streams user&apos;s webcam video onto a <code>&lt;canvas&gt;</code> element.</li>
          <li>Overlays detection visuals (bounding boxes, landmarks, expressions) on the canvas.</li>
          <li>Records the processed canvas stream using the <code>MediaRecorder</code> API.</li>
          <li>Allows saving of the recording to Local file system (.mp4 file), browser&apos;s <code>localStorage</code> as base64 (as required in the spec).</li>
          <li>Displays previously saved recordings on reload (if available in <code>localStorage</code>).</li>
        </ul>

        <h2 className='text-2xl mt-3 mb-2 ml-1'> Technologies Used </h2>
        <table>
          <thead className='border-gray-600 border-b-1'>
            <tr>
              <th>Technology</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Next.js</code></td>
              <td>React framework enabling SSR/CSR hybrid rendering and routing</td>
            </tr>
            <tr>
              <td><code>React</code></td>
              <td>UI framework to build and control component state and lifecycle</td>
            </tr>
            <tr>
              <td><code>face-api.js</code></td>
              <td>Machine learning-based facial recognition and analysis in browser</td>
            </tr>
            <tr>
              <td><code>MediaRecorder</code></td>
              <td>Web API to record media streams from canvas</td>
            </tr>
            <tr>
              <td><code>HTML5 Canvas</code></td>
              <td>Drawing and overlaying detection results</td>
            </tr>
            <tr>
              <td><code>localStorage</code></td>
              <td>Saving recordings in base64 format for persistence</td>
            </tr>
            <tr>
              <td><code>MUI (Material UI)</code></td>
              <td>For UI elements like buttons and switches</td>
            </tr>
          </tbody>
        </table>
        <h2 className='text-2xl mt-3 mb-2 ml-1'> Features </h2>

        <h3 className='text-xl mt-3 mb-2 ml-1'> Real-Time Face Detection </h3>
        <ul className="list-disc list-inside">
          <li>Streams live video from the user&apos;s webcam onto a <code>&lt;canvas&gt;</code> element.</li>
          <li>Uses <code>face-api.js</code> to detect all visible faces in real-time.</li>
        </ul>

        <h3 className='text-xl mt-3 mb-2 ml-1'> Facial Landmark & Expression Analysis </h3>
        <ul className="list-disc list-inside">
          <li>Toggle facial landmarks (eyes, nose, jawline, etc.) and expression detection (happy, sad, surprised, etc.) using intuitive UI switches.</li>
          <li>Optional and configurable to reduce computational overhead.</li>
        </ul>

        <h3 className='text-xl mt-3 mb-2 ml-1'> Canvas-Based Video Recording </h3>
        <ul className="list-disc list-inside">
          <li>Records the processed canvas (including face overlays) using the MediaRecorder API.</li>
          <li>Captures exactly what is seen on the screen not just the raw video feed.</li>
        </ul>

        <h3 className='text-xl mt-3 mb-2 ml-1'> Download and Save Recordings </h3>
        <ul className="list-disc list-inside">
          <li>One-click option to download the recorded video as an .mp4 file.</li>
          <li>Option to save the recording to browser localStorage (base64 encoded) for session persistence.</li>
        </ul>

        <h3 className='text-xl mt-3 mb-2 ml-1'> Session Persistence </h3>
        <ul className="list-disc list-inside">
          <li>On reload, previously saved recordings (if any) are automatically loaded from localStorage.</li>
          <li>Includes option to clear saved recordings.</li>
        </ul>

        <h3 className='text-xl mt-3 mb-2 ml-1'> Toggleable Options Without Reload </h3>
        <ul className="list-disc list-inside">
          <li>Uses <code>useRef</code> to track live state without triggering re-renders—critical for maintaining performance during real-time detection and animation.</li>
        </ul>

        <h3 className='text-xl mt-3 mb-2 ml-1'> Lightweight & Fully Client-Side </h3>
        <ul className="list-disc list-inside">
          <li>All processing is done client-side. No server interaction required.</li>
        </ul>

      </div>

      <div className='p-12'>
        <Button variant="contained" onClick={() => { router.push('/app') }}> Open Face Tracker </Button>
      </div>
    </div>
  )
}