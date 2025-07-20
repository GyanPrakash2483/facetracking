
# Face Tracking & Recording App

## 🧠 Technologies Used

| Technology       | Purpose                                                                 |
|------------------|-------------------------------------------------------------------------|
| **Next.js**      | React framework enabling SSR/CSR hybrid rendering and routing           |
| `React`          | UI framework to build and control component state and lifecycle         |
| `face-api.js`    | Machine learning-based facial recognition and analysis in browser       |
| `MediaRecorder`  | Web API to record media streams from canvas                             |
| `HTML5 Canvas`   | Drawing and overlaying detection results                                |
| `localStorage`   | Saving recordings in base64 format for persistence                      |
| `MUI (Material UI)` | For UI elements like buttons and switches                            |

---

## ✨ Features

### 🎥 Real-Time Face Detection  
- Streams live video from the user's webcam onto a `<canvas>` element.  
- Uses `face-api.js` to detect all visible faces in real-time.

### 🧠 Facial Landmark & Expression Analysis  
- Toggle facial landmarks (eyes, nose, jawline, etc.) and expression detection (happy, sad, surprised, etc.) using intuitive UI switches.  
- Optional and configurable to reduce computational overhead.

### 📹 Canvas-Based Video Recording  
- Records the processed canvas (including face overlays) using the MediaRecorder API.  
- Captures exactly what is seen on the screen—not just the raw video feed.

### 💾 Download and Save Recordings  
- One-click option to **download the recorded video** as an `.mp4` file.  
- Option to **save the recording to browser localStorage** (base64 encoded) for session persistence.

### ♻️ Session Persistence  
- On reload, previously saved recordings (if any) are automatically loaded from localStorage.  
- Includes option to clear saved recordings.

### 🔄 Toggleable Options Without Reload  
- Uses `useRef` to track live state without triggering re-renders—critical for maintaining performance during real-time detection and animation.

### 📦 Lightweight & Fully Client-Side  
- All processing is done client-side. No server interaction required.  
- Keeps user data local to the browser for privacy.

---

## 🔍 Project Overview

The application is a **React-based face tracking and video recording tool** that:

- Uses `face-api.js` to detect **faces**, **facial landmarks**, and **facial expressions**.
- Streams user's webcam video onto a `<canvas>` element.
- Overlays detection visuals (bounding boxes, landmarks, expressions) on the canvas.
- Records the processed canvas stream using the `MediaRecorder` API.
- Allows saving of the recording to:
  - Local file system (`.mp4` file).
  - Browser's `localStorage` as base64 (as required in the spec).
- Displays previously saved recordings on reload (if available in `localStorage`).

---

## ⚙️ Architecture Breakdown

### 1. **Model Loading**
```js
await faceapi.loadAgeGenderModel('/models')
await faceapi.loadFaceExpressionModel('/models')
await faceapi.loadFaceLandmarkModel('/models')
await faceapi.loadSsdMobilenetv1Model('/models')
```

### 2. **Video Stream + Face Detection**
- Webcam is accessed via `getUserMedia()`.
- The stream is attached to an off-screen `<video>` element.
- Detection results are resized and drawn using `face-api.js` utilities.

### 3. **Dynamic Feature Toggling**
- `useRef` ensures smooth toggling inside the animation loop.

### 4. **Recording Logic**
- Uses `canvas.captureStream()` and `MediaRecorder`.

### 5. **Save & Load Video**
- Save to disk or to `localStorage`.
- `Blob -> Base64 -> localStorage`.

---

## 💡 Design Decisions

| Feature                        | Implementation Detail                                                  |
|-------------------------------|-------------------------------------------------------------------------|
| **Modularity**                | Some logic kept outside component due to time constraints.             |
| **Real-Time Control**         | `useRef` used inside loop for latest state access.                     |
| **Recording Source**          | Canvas stream is recorded for visual overlays.                         |
| **Persistence**               | Uses `localStorage` per spec; suggests `IndexedDB` for future upgrades.|
| **Error Handling**            | Wrapped in try-catch to gracefully handle detection errors.            |

---

## 🧪 Areas of Improvement

| Issue                          | Suggestion                                                             |
|--------------------------------|------------------------------------------------------------------------|
| Global state usage             | Replace with `useRef` for cleaner design.                              |
| MediaRecorder MIME type        | Specify MIME type for better browser support.                         |
| Large storage limits           | Use `IndexedDB` for large video files.                                |
| Visual feedback                | Add loading spinner or detection status display.                      |
| Accessibility                  | Improve accessibility with `aria-*` attributes.                        |

---

## ✅ Summary

This app efficiently combines real-time face detection with recording functionality in the browser. It's fully client-side, easy to use, and suitable for demonstrations, learning, and prototyping AI-based webcam tools.

