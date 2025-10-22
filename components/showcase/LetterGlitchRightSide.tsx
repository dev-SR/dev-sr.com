import LetterGlitch from '@/components/showcase/LetterGlitch';

export default function LetterGlitchRightSide() {
  return (
    <div className="col-span-2 relative min-h-screen -mt-[50px] z-30 ">
      <LetterGlitch
        glitchSpeed={50}
        centerVignette={true}
        outerVignette={false}
        smooth={true}
        glitchColors={['#2a2c3a', '#60717a', '#454f54']}
      />
      {/* Transparent Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-70% to-background pointer-events-none" />
      {/*    Top Transparent Gradient Overlay*/}
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-background to-transparent to-80% pointer-events-none" />
    </div>
  );
}
