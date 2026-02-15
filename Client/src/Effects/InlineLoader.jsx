// Effects/InlineLoader.jsx
import React from "react";
import styled from "styled-components";

export default function InlineLoader() {
  return (
    <Wrap>
      <svg viewBox="25 25 50 50">
        <circle r={20} cy={50} cx={50} />
      </svg>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;   /* space above/below */

  svg {
    width: 2em;     /* smaller than fullscreen */
    transform-origin: center;
    animation: rotate4 2s linear infinite;
  }

  circle {
    fill: none;
    stroke: hsl(214, 97%, 59%);
    stroke-width: 2;
    stroke-dasharray: 1, 200;
    stroke-linecap: round;
    animation: dash4 1.5s ease-in-out infinite;
  }

  @keyframes rotate4 {
    100% { transform: rotate(360deg); }
  }

  @keyframes dash4 {
    0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
    50% { stroke-dasharray: 90, 200; stroke-dashoffset: -35px; }
    100% { stroke-dashoffset: -125px; }
  }
`;
