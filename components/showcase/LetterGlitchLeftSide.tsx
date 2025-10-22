import LetterGlitch from '@/components/showcase/LetterGlitch';

export default function LetterGlitchLeftSide() {
  return (
    <div className="col-span-2 relative min-h-screen -mt-[150px] z-30">
      <LetterGlitch
        glitchSpeed={50}
        centerVignette={true}
        outerVignette={false}
        smooth={true}
        glitchColors={['#2a2c3a', '#c47670', '#6c4845']}
      />
      {/* Transparent Gradient Overlay  */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background to-70% pointer-events-none" />
      {/*    Top Transparent Gradient Overlay*/}
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-background to-transparent to-80% pointer-events-none" />
    </div>
  );
}
