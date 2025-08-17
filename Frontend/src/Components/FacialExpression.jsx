import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';

export default function FacialExpression({ setSongs, setExpression }) {
  const videoRef = useRef();
  const streamRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showVideo, setShowVideo] = useState(true); // control whether to show camera or default image

  const loadModels = async () => {
    const MODEL_URL = '/models';
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      setShowVideo(true); // trigger re-render so <video> is mounted

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsStreaming(true);
        } else {
          console.error("videoRef.current is null");
        }
      }, 100); // slight delay ensures <video> is mounted

    } catch (err) {
      console.error("Error accessing webcam: ", err);
    }
  };


  const stopVideo = () => {
    if (videoRef.current) videoRef.current.pause();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    setShowVideo(false); // hide camera, show default image
  };

  const detectMood = async () => {
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!detections || detections.length === 0) {
      console.log("No face detected");
      setExpression("No face detected");
      setSongs([]);
      return;
    }

    const expressions = detections[0].expressions;
    let maxValue = 0;
    let dominantExpression = "";

    for (const key in expressions) {
      if (expressions[key] > maxValue) {
        maxValue = expressions[key];
        dominantExpression = key;
      }
    }

    console.log("Detected Expression:", dominantExpression);
    setExpression(dominantExpression);
    stopVideo(); // hide camera and show image

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}songs?mood=${dominantExpression}`
      );
      console.log(res);
      
      setSongs(res.data.song);
    } catch (err) {
      console.error("Failed to fetch songs:", err);
      setSongs([]);
    }
  };

  useEffect(() => {
    loadModels();
    return () => stopVideo();
  }, []);

  return (
    <div className="p-6 flex flex-col sm:flex-row xl:justify-start justify-center items-center">
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          className="rounded-lg w-60 h-60 object-cover bg-gray-200 transform scale-x-[-1]"
        />
      ) : (
        <img
          src="https://img.freepik.com/premium-photo/happy-man-ai-generated-portrait-user-profile_1119669-1.jpg?w=2000" // change this to your actual default image path
          alt="Default Face"
          className="rounded-lg w-60 h-60 object-cover bg-gray-100"
        />
      )}

      <div className="mt-4 text-center">
        <h3 className="text-xl font-semibold mb-2">Live Mood Detection</h3>
        <p className="text-gray-600 mb-4 max-w-sm">
          Your current mood is being analyzed in real-time. Enjoy music tailored to your feelings.
        </p>
        <button
          onClick={async () => {
            if (!isStreaming) {
              await startVideo(); // re-open camera
            } else await detectMood();
          }}
          className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition"
        >
          Start Listening
        </button>
      </div>
    </div>
  );
}
