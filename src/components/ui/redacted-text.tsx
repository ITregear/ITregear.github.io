import React from "react";

interface RedactedTextProps {
  text: string;
}

function getRandomWidth() {
  // width between 4em and 8em
  return `${Math.random() * 4 + 4}em`;
}

function getRandomSkew() {
  // skew between -2deg and 2deg
  return `${Math.random() * 4 - 2}deg`;
}

function getRandomPoints(width: number, height: number, segments = 8): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const x = (width / segments) * i;
    const y = height / 2 + (Math.random() - 0.5) * height * 0.12;
    points.push([x, y]);
  }
  return points;
}

function getSmoothPath(points: [number, number][], height: number) {
  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    const cx = (x1 + x2) / 2;
    d += ` Q ${cx},${y1} ${x2},${y2}`;
  }
  for (let i = points.length - 1; i >= 0; i--) {
    const [x, y] = points[i];
    const yBottom = y + height * 0.4 + (Math.random() - 0.5) * height * 0.06;
    if (i === points.length - 1) {
      d += ` L ${x},${yBottom}`;
    } else {
      const [xPrev, yPrev] = points[i + 1];
      const cx = (x + xPrev) / 2;
      d += ` Q ${cx},${yPrev + height * 0.4} ${x},${yBottom}`;
    }
  }
  d += ' Z';
  return d;
}

function RedactedBar({ idx }: { idx: number }) {
  const width = Math.random() * 80 + 80; // 80-160px
  const height = 25 + Math.random() * 4; // 18-22px
  const points = getRandomPoints(width, height);
  const path = getSmoothPath(points, height);
  return (
    <svg
      key={`redacted-bar-${idx}`}
      width={width}
      height={height * 1.2}
      viewBox={`0 0 ${width} ${height * 1.2}`}
      style={{
        display: 'inline-block',
        margin: '0 0.5em',
        verticalAlign: 'middle',
      }}
      aria-label="redacted"
    >
      <path
        d={path}
        fill="#181818"
        stroke="#181818"
        strokeWidth={2.5}
        style={{ filter: 'blur(0.3px)' }}
      />
    </svg>
  );
}

export default function RedactedText({ text }: RedactedTextProps) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const numRedacted = Math.floor(Math.random() * 5) + 1;
  let insertPositions: number[] = [];
  while (insertPositions.length < numRedacted) {
    const pos = Math.floor(Math.random() * (sentences.length + 1));
    if (!insertPositions.includes(pos)) insertPositions.push(pos);
  }
  insertPositions.sort((a, b) => a - b);

  let result: React.ReactNode[] = [];
  let redactedIdx = 0;
  for (let i = 0; i <= sentences.length; i++) {
    if (insertPositions.includes(i)) {
      result.push(<RedactedBar key={`redacted-bar-${i}`} idx={i} />);
      redactedIdx++;
    }
    if (i < sentences.length) {
      result.push(<span key={`sentence-${i}`}>{sentences[i]}</span>);
    }
  }

  return <>{result}</>;
} 