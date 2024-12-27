"use client";
import React, { useEffect, useRef, useState } from "react";
import { ExerciseType } from "../workoutPlan/[workoutPlanId]/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ExerciseListProps {
  exercises: ExerciseType[];
  className?: string;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, className }) => {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(null);
  const [filter, setFilter] = useState("all");
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const [isYouTubeLoaderReady, setIsYouTubeLoaderReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const filteredExercises =
    filter === "all"
      ? exercises
      : exercises.filter((exercise: ExerciseType) =>
        exercise.focusArea.toLowerCase().includes(filter)
      );

  useEffect(() => {
    //@ts-ignore
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
      (window as any).onYouTubeIframeAPIReady = () => {
        setIsYouTubeLoaderReady(true);
      };
    } else {
      setIsYouTubeLoaderReady(true);
    }
  }, []);

  useEffect(() => {
    console.log("isPlaying:", isPlaying);
  }, [isPlaying]);

  const initializePlayer = (videoId: string) => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    if (videoRef.current) {
      //@ts-ignore
      playerRef.current = new window.YT.Player(videoRef.current, {
        videoId,
        width: "100%",
        height: "100%",
        events: {
          onReady: (event: any) => {
            event.target.playVideo();
            setIsPlaying(true); // Start playing
          },
          onStateChange: (event: any) => {
            //@ts-ignore
            if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false); // Video ended
              //@ts-ignore
            } else if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true); // Video playing
            }
          },
        },
      });
    }
  };

  const handlePlayVideo = () => {
    const videoId = selectedExercise?.videoUrl;
    //@ts-ignore
    if (isYouTubeLoaderReady && window.YT && videoId) {
      initializePlayer(videoId);
    } else {
      console.log("YouTube Player not ready or missing video URL");
    }
  };

  const handleExerciseClick = (exercise: ExerciseType) => {
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    setIsPlaying(false); // Reset to thumbnail view
    setSelectedExercise(exercise || null);
  };


  return (
    <div className={`flex flex-col md:flex-row h-screen text-white rounded-3xl ${className || ""}`}>
      {/* Sidebar */}
      <div className="w-full md:w-1/3 p-4 bg-[#1e1e1e]">
        {/* Filter Buttons */}
        <nav className="bg-[#2a2a2a] p-2 rounded-full flex flex-wrap lg:flex-nowrap justify-center md:justify-start gap-2 mb-4">
          {["All", "Chest", "Back", "Legs", "Arms", "Core", "Shoulders", "FullBody", "Other", "UpperBody", "LowerBody"].map(
            (category) => (
              <button
                key={category}
                onClick={() => setFilter(category.toLowerCase())}
                className={`px-5 py-1 text-xs rounded-full ${
                  filter === category.toLowerCase() ? "bg-customBlue" : "bg-[#1e1e1e] hover:bg-[#555555]"
                }`}
              >
                {category}
              </button>
            )
          )}
        </nav>
        <ul className="space-y-2">
          {filteredExercises.map((exercise) => (
            <li
              key={exercise.slug}
              onClick={() => handleExerciseClick(exercise)}
              className={`flex items-center justify-between p-3 cursor-pointer rounded-full ${
                selectedExercise?.slug === exercise.slug
                  ? "bg-customBlue"
                  : "bg-[#2a2a2a] hover:bg-[#333333]"
              }`}
            >
              <div className="flex items-baseline gap-2">
                <h3 className="text-sm">{exercise.name}</h3>
                <p className="text-xs text-gray-300 font-extralight">{exercise.focusArea}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Video Preview */}
      <div className="flex-1 md:flex items-center justify-center bg-[#1e1e1e] p-1">
        <div className="w-full md:w-2/3 h-60 md:h-2/3 bg-black rounded-lg relative">
          {/* Thumbnail and Play Button */}
          {selectedExercise && !isPlaying && (
            <>
              <img
                src={`${NEXT_PUBLIC_API_BASE_URL}/uploads/exercises/${
                  selectedExercise ? selectedExercise.slug : ""
                }`}
                alt={selectedExercise ? selectedExercise.name : ""}
                // layout="fill"
                // objectFit="cover"
                className="rounded-lg"
              />
              <button
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg z-10"
                onClick={
                  handlePlayVideo}
              >
                <FontAwesomeIcon icon={faPlay} size="3x" className="text-white"/>
              </button>
            </>
          )}
          {/* Video Player */}
          <div
            ref={videoRef}
            className={`absolute inset-0 w-full h-full rounded-lg`}
          />
        </div>
      </div>
    </div>
  );
};

export default ExerciseList;
