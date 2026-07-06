'use client';

import {useEffect, useState} from 'react';

interface Props {
  line1: string;
  line2: string;
  line3: string;
}

export function HeroHeading({line1, line2, line3}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const base =
    'block transition-[opacity,transform] duration-700 ease-out';
  const hidden = 'opacity-0 translate-y-6';
  const shown = 'opacity-100 translate-y-0';

  return (
    <h1
      data-tour="hero"
      className="mt-4 font-heading leading-[1.0] tracking-wide text-white"
      style={{fontSize: 'clamp(3rem, 11vw, 11rem)'}}
    >
      <span
        className={`${base} text-brand-cyan ${visible ? shown : hidden}`}
        style={{transitionDelay: visible ? '0ms' : '0ms'}}
      >
        {line1}
      </span>
      <span
        className={`${base} ${visible ? shown : hidden}`}
        style={{transitionDelay: visible ? '150ms' : '0ms'}}
      >
        {line2}
      </span>
      <span
        className={`${base} text-brand-cyan ${visible ? shown : hidden}`}
        style={{transitionDelay: visible ? '300ms' : '0ms'}}
      >
        {line3}
      </span>
    </h1>
  );
}
