'use client';

import {useEffect, useState, type CSSProperties} from 'react';

interface Props {
  line1: string;
  line2: string;
  line3: string;
}

const EASING = 'cubic-bezier(0, 0, 0.2, 1)';

export function HeroHeading({line1, line2, line3}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Double RAF: ensures the browser paints the hidden state
    // at least once before we trigger the transition.
    let id2: number;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, []);

  const lineStyle = (delay: number): CSSProperties => ({
    display: 'block',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(1.5rem)',
    transition: `opacity 700ms ${EASING}, transform 700ms ${EASING}`,
    transitionDelay: `${visible ? delay : 0}ms`,
  });

  return (
    <h1
      data-tour="hero"
      className="mt-4 font-heading leading-[1.0] tracking-wide"
      style={{fontSize: 'clamp(3rem, 11vw, 11rem)'}}
    >
      <span className="text-brand-cyan" style={lineStyle(0)}>
        {line1}
      </span>
      <span className="text-white" style={lineStyle(150)}>
        {line2}
      </span>
      <span className="text-brand-cyan" style={lineStyle(300)}>
        {line3}
      </span>
    </h1>
  );
}
