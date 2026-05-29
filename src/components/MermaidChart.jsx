import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: true, theme: 'dark' });

function MermaidChart({ chart }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = '';
      mermaid.render('mermaid-svg', chart).then(({ svg }) => {
        ref.current.innerHTML = svg;
      });
    }
  }, [chart]);

  return <div ref={ref} className="flex justify-center p-4" />;
}

export default MermaidChart;