import { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedNumber({
  value,
  duration = 900,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  style,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const startValue = previousValue.current;
    const diff = value - startValue;
    if (diff === 0) return;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(startValue + diff * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        previousValue.current = value;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  const formatted = displayValue.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={className} style={style}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
