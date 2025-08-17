import React, { useState, useRef } from 'react';
import FacialExpression from './FacialExpression';

const MoodPlayer = () => {
  const [songs, setSongs] = useState([]);
  const [expression, setExpression] = useState('');
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef();

  const playSong = (song) => {
    if (currentSong && currentSong.audio === song.audio && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setCurrentSong(song);
      setTimeout(() => {
        audioRef.current.play();
        setIsPlaying(true);
      }, 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };
  console.log(songs);

  return (
    <div className="min-h-screen bg-[#fdf9ff] text-black p-6 sm:p-10 font-sans">
      <header className="mb-6">
        <h1 className="text-lg font-semibold">🎵 Moody Player</h1>
      </header>

      <h2 className="text-3xl sm:text-4xl font-bold mb-6">Live Mood Detection</h2>

      <FacialExpression setSongs={setSongs} setExpression={setExpression} />

      {expression && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">
            Detected Mood: <span className="text-purple-700">{expression}</span>
          </h3>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recommended Tracks</h3>
        {songs.length > 0 ? (
          <ul className="space-y-4">
            {songs.map((track, index) => (
              <li
                key={index}
                onClick={() => playSong(track)} // Clicking anywhere triggers play/pause
                className="flex justify-between items-center border-b pb-2 cursor-pointer hover:bg-purple-50 px-3 py-2 rounded-lg transition"
              >
                <div>
                  <p className="font-medium">{track.title}</p>
                  <p className="text-sm text-gray-500">{track.artist}</p>
                </div>
                <div className="text-gray-600 hover:text-purple-600">
                  {currentSong?.audio === track.audio && isPlaying ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                    >
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tracks to show. Detect a mood to get started.</p>
        )}
      </div>

      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        src={currentSong?.audio}
        onEnded={handleEnded}
        className="hidden"
        controls
      />
    </div>
  );
};

export default MoodPlayer;
