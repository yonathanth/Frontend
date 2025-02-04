import React, { useRef, useEffect, useState } from "react";

interface WebcamCaptureProps {
  onCapture: (image: string | null) => void;
  onClose: () => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  onCapture,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user"); // "user" = front, "environment" = back
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  useEffect(() => {
    const checkCameraAvailability = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setHasMultipleCameras(videoDevices.length > 1); // Enable switching if more than one camera exists
      } catch (error) {
        console.error("Error checking camera availability:", error);
        setHasMultipleCameras(false);
      }
    };

    checkCameraAvailability();
  }, []);

  useEffect(() => {
    startCamera();

    return () => stopCamera(); // Cleanup when component unmounts
  }, []);

  const startCamera = async () => {
    try {
      // Stop any existing stream before starting a new one
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }

      streamRef.current = stream;
    } catch (err) {
      console.error("Error accessing webcam: ", err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const toggleCamera = async () => {
    if (!streamRef.current) return;

    try {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      const newFacingMode = facingMode === "user" ? "environment" : "user";

      const supports = videoTrack.getCapabilities();
      if (supports.facingMode) {
        await videoTrack.applyConstraints({ facingMode: newFacingMode });
      } else {
        // If applyConstraints is not supported, fallback to restarting the stream
        setFacingMode(newFacingMode);
        startCamera();
      }
    } catch (error) {
      console.error("Error switching camera:", error);
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageUrl = canvasRef.current.toDataURL("image/png");
        onCapture(imageUrl);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-11/12 sm:w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Capture your photo
        </h2>

        <video
          ref={videoRef}
          className="w-full h-auto border border-gray-300 rounded-lg"
          style={{ maxWidth: "400px" }}
        ></video>

        {!isCameraActive && (
          <p className="text-red-500 text-center">
            Unable to access the camera.
          </p>
        )}

        <button
          onClick={capturePhoto}
          className="mt-4 w-full p-3 bg-customBlue text-white rounded-lg"
        >
          Capture Photo
        </button>

        {hasMultipleCameras && (
          <button
            type="button"
            onClick={toggleCamera}
            className="mt-4 w-full p-3 bg-customBlue text-white rounded-lg"
          >
            Switch Camera
          </button>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full p-3 bg-gray-500 text-white rounded-lg"
        >
          Close
        </button>

        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
};

export default WebcamCapture;
