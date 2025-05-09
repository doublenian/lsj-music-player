import { MusicPlayer } from "@/components/music-player";

export default function Home(): React.ReactNode {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1>Hello World</h1>
      <MusicPlayer />
    </div>
  );
}
