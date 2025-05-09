"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Music } from "lucide-react";
import { cn } from "@/lib/utils";

// Placeholder Image component
const PlaceholderImage = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
    <Music className="h-1/2 w-1/2 text-gray-400" />
  </div>
);

const songs = [
  {
    id: 1,
    title: "Moanin'",
    artist: "Art Blakey & The Jazz Messengers",
    album: "Moanin'",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3",
  },
  {
    id: 2,
    title: "Imagine",
    artist: "John Lennon",
    album: "Imagine",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_07_-_Interception.mp3",
  },
  {
    id: 3,
    title: "Billie Jean",
    artist: "Michael Jackson",
    album: "Thriller",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3",
  },
  {
    id: 4,
    title: "Like a Rolling Stone",
    artist: "Bob Dylan",
    album: "Highway 61 Revisited",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
  },
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(currentSong.url);

    const audio = audioRef.current;
    audio.src = currentSong.url;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleEnded);

    if (isPlaying) audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong, isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playSong = (song: (typeof songs)[0]) => {
    if (currentSong.id !== song.id) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSong(song);
        setIsPlaying(true);
        setIsTransitioning(false);
      }, 300);
    } else {
      togglePlay();
    }
  };

  const handleSliderChange = (newValue: [number]) => {
    const [value] = newValue;
    const newTime = (value / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const nextSong = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
      const nextIndex = (currentIndex + 1) % songs.length;
      setCurrentSong(songs[nextIndex]);
      setIsTransitioning(false);
      if (isPlaying) setIsPlaying(true);
    }, 300);
  };

  const previousSong = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
      const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
      setCurrentSong(songs[previousIndex]);
      setIsTransitioning(false);
      if (isPlaying) setIsPlaying(true);
    }, 300);
  };

  return (
    <Card className="w-full max-w-[95%] mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 md:items-center">
          <div 
            className={cn(
              "w-full md:w-1/2 mb-6 md:mb-0 relative aspect-square transition-all duration-500 ease-in-out",
              isPlaying && "animate-pulse-subtle",
              isTransitioning && "opacity-0 scale-95"
            )}
          >
            <div 
              className={cn(
                "rounded-md w-full h-full transition-transform duration-500",
                isPlaying && "animate-album-rotation"
              )}
            >
              <PlaceholderImage className="rounded-md w-full h-full" />
            </div>
          </div>

          <div 
            className={cn(
              "w-full md:w-1/2 space-y-4 flex flex-col justify-center transition-opacity duration-300",
              isTransitioning && "opacity-0"
            )}
          >
            <div className="transition-all duration-300 ease-in-out transform hover:translate-x-1">
              <h2 className="text-2xl font-bold">{currentSong.title}</h2>
              <p className="text-gray-500">{currentSong.artist}</p>
            </div>
            <div className="space-y-2">
              <div className="relative h-2">
                <Slider
                  value={[(currentTime / duration) * 100 || 0]}
                  max={100}
                  step={1}
                  onValueChange={handleSliderChange}
                  className="transition-all duration-200"
                />
                <div 
                  className="absolute bottom-0 left-0 h-0.5 bg-primary rounded-full transition-all duration-200"
                  style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={previousSong}
                className="transition-transform duration-200 hover:scale-110 active:scale-95 hover:bg-secondary"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button 
                onClick={togglePlay} 
                size="icon"
                className="transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 hover:bg-primary/90"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 animate-pulse-subtle" />
                ) : (
                  <Play className="h-4 w-4 transition-transform duration-200 hover:translate-x-0.5" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={nextSong}
                className="transition-transform duration-200 hover:scale-110 active:scale-95 hover:bg-secondary"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {songs.map((song) => (
            <Card
              key={song.id}
              className={cn(
                "transition-all duration-200 hover:shadow-md",
                currentSong.id === song.id 
                  ? "bg-muted border-primary border-l-4" 
                  : "hover:translate-x-1 hover:bg-gray-50/50"
              )}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div 
                      className={cn(
                        "w-12 h-12 flex-shrink-0 overflow-hidden transition-all duration-300",
                        currentSong.id === song.id && isPlaying && "animate-pulse-subtle"
                      )}
                    >
                      <PlaceholderImage 
                        className={cn(
                          "w-full h-full rounded transition-transform duration-300",
                          currentSong.id === song.id && isPlaying && "animate-album-rotation-slow"
                        )} 
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">
                        {song.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {song.artist}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => playSong(song)}
                    className="transition-transform duration-200 hover:scale-110 active:scale-95"
                  >
                    {currentSong.id === song.id && isPlaying ? (
                      <Pause className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse-subtle" />
                    ) : (
                      <Play className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 hover:translate-x-0.5" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
