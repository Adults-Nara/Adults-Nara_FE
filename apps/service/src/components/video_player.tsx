import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
  playlist: { url: string; title: string }[];
  currentIndex: number;
}

export default function VideoPlayer({ url }: { url: string }) {
  return (
    <ReactPlayer
      slot="media"
      src="https://stream.mux.com/maVbJv2GSYNRgS02kPXOOGdJMWGU1mkA019ZUjYE7VU7k"
      controls={false}
      style={{
        width: '100%',
        height: '100%',
      }}
    ></ReactPlayer>
  );
}
