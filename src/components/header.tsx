import React from "react";

// Dynamically import all PNG images from the hero-images folder
const imageModules = import.meta.glob("@/assets/hero-images/*.png", { eager: true, import: 'default' });
const images = Object.values(imageModules) as string[];

function getNextIndex(current: number) {
  return (current + 1) % images.length;
}

function getCurrentIndex() {
  const stored = window.localStorage.getItem('heroImageIndex');
  const current = stored ? parseInt(stored, 10) : 0;
  return isNaN(current) ? 0 : current;
}

export default function Header() {
  const [index, setIndex] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return getCurrentIndex();
    }
    return 0;
  });

  const handleClick = () => {
    setIndex(i => {
      const next = getNextIndex(i);
      window.localStorage.setItem('heroImageIndex', String(next));
      return next;
    });
  };

  const planeImage = images[index];

  return (
    <header className="container mx-auto px-6 py-8 pt-[0px] pb-[0px]">
      <div className="max-w-5xl mx-auto">
        {/* Desktop Layout: Name and Plane Side by Side */}
        <div className="hidden md:flex md:items-center md:justify-between md:mb-6">
          <div className="md:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-bold typewriter-text text-left mb-4">
              IVAN TREGEAR
            </h1>
            <div className="h-1 w-32 bg-stamp-red opacity-60"></div>
          </div>
          
          {/* Plane Image - Desktop */}
          <div className="md:w-1/2 md:pl-12 flex justify-center">
            {planeImage && (
              <img 
                src={planeImage} 
                alt="Vintage aircraft blueprint" 
                className="max-w-full h-auto opacity-90 cursor-pointer" 
                onClick={handleClick}
                title="Click to cycle image"
                style={{userSelect: 'none'}}
                draggable={false}
              />
            )}
          </div>
        </div>
        {/* Mobile Layout: Name, then Plane */}
        <div className="md:hidden">
          <h1 className="text-3xl font-bold typewriter-text text-left mb-6">
            IVAN TREGEAR
          </h1>
          <div className="h-1 w-24 bg-stamp-red opacity-60 mb-4"></div>
          
          {/* Plane Image - Mobile */}
          <div className="mb-4 flex justify-center">
            {planeImage && (
              <img 
                src={planeImage} 
                alt="Vintage aircraft blueprint" 
                className="max-w-full h-auto opacity-90 cursor-pointer" 
                onClick={handleClick}
                title="Click to cycle image"
                style={{userSelect: 'none'}}
                draggable={false}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}