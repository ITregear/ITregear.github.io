import React from "react";

// To add more hero images, place PNG files in: src/assets/hero-images
// All PNGs in this folder will be used automatically.

// Dynamically import all PNG images from the hero-images folder
const imageModules = import.meta.glob("@/assets/hero-images/*.png", { eager: true, import: 'default' });
const images = Object.values(imageModules) as string[];

function getRandomImage() {
  return images[Math.floor(Math.random() * images.length)];
}

const HeroImageRandom: React.FC = () => {
  const [img] = React.useState(() => getRandomImage());
  if (!img) return null;
  return (
    <img
      src={img}
      alt="Hero plane"
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "220px",
        height: "auto",
        zIndex: 50,
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.12)",
        pointerEvents: "none",
        userSelect: "none",
      }}
      draggable={false}
    />
  );
};

export default HeroImageRandom; 