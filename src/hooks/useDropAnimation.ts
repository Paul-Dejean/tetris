import { useEffect, useRef } from "react";
import { Action, ActionType, GameAnimation, Piece } from "../state/types";
import {
  getLastValidPosition,
  getPieceBlocksCoordinates,
} from "../engine/board";

export function useDropPieceAnimation({
  board,
  piece,
  cellHeight,
  dispatch,
  animation,
  duration = 200,
}: {
  board: string[][];
  piece: Piece;
  cellHeight: number;
  animation: GameAnimation | null;
  dispatch: (action: Action) => void;
  duration?: number;
}) {
  const isStarted = useRef(false);
  useEffect(() => {
    if (!isStarted.current && animation === GameAnimation.DROP_PIECE) {
      isStarted.current = true;

      const coordinates = getPieceBlocksCoordinates(piece);
      const elements = coordinates
        .map((position) =>
          document.querySelector(`#cell-${position.y}-${position.x}`)
        )
        .filter((element) => element != null);

      const lastValidPosition = getLastValidPosition(board, piece);

      const gridDistance = lastValidPosition.y - piece.position.y;

      const dropDistance = gridDistance * cellHeight;

      dropAnimation(elements as HTMLElement[], dropDistance, duration, () => {
        isStarted.current = false;
        dispatch({ type: ActionType.END_HARD_DROP });
      });
    }
  }, [board, piece, cellHeight, duration, dispatch, animation]);
}

function dropAnimation(
  elements: HTMLElement[],
  distance: number,
  duration: number,
  callback?: () => void
) {
  let start: number | null = null;

  const initialStyle = {
    backgroundColor: elements[0].style.backgroundColor,
    borderColor: elements[0].style.borderColor,
    borderWidth: elements[0].style.borderWidth,
  };

  elements.forEach((element) => {
    element.style.borderColor = "white";
    element.style.borderWidth = "1px";
    element.style.backgroundColor = "transparent";
  });

  console.log({ elements });

  const trailingLightDiv = createTrailingLightDiv(elements);
  const pathElem = trailingLightDiv.querySelector("path") as SVGPathElement;
  const { bottom, top } = getElementsBoundingRect(elements);
  const height = bottom - top;

  document.body.appendChild(trailingLightDiv);

  const step = (timestamp: number) => {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const progress = easeOut(elapsed / duration);

    trailingLightDiv.style.height =
      Math.max(height + progress * distance, 30) + "px";

    elements.forEach((element) => {
      pathElem.setAttribute("transform", `translate(0 ${progress * distance})`);
      element.style.transform = `translateY(${progress * distance}px)`;
    });

    if (elapsed < duration) {
      requestAnimationFrame(step);
    } else {
      if (callback) callback();
      setTimeout(() => {
        document.body.removeChild(trailingLightDiv);
        elements.forEach((element) => {
          console.log({ initialStyle });
          element.style.borderWidth = initialStyle.borderWidth;
          element.style.backgroundColor = initialStyle.backgroundColor;
          element.style.borderColor = initialStyle.borderColor;
          element.style.opacity = "1";
          element.style.boxShadow = "none";
          element.style.transform = "none";
          element.style.backgroundImage = "none";
        });
      }, 0);
    }
  };
  requestAnimationFrame(step);
}

function getElementsBoundingRect(elements: HTMLElement[]) {
  const blocks = elements.map((el) => {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
    };
  });
  const { left, right, top, bottom } = blocks.reduce(
    (acc, block) => {
      return {
        left: Math.min(acc.left, block.left),
        right: Math.max(acc.right, block.right),
        top: Math.min(acc.top, block.top),
        bottom: Math.max(acc.bottom, block.bottom),
      };
    },
    { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
  );
  return { left, right, top, bottom };
}

function createTrailingLightDiv(elements: HTMLElement[]) {
  const blocks = elements.map((el) => {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
    };
  });

  const { left, right, top, bottom } = blocks.reduce(
    (acc, block) => {
      return {
        left: Math.min(acc.left, block.left),
        right: Math.max(acc.right, block.right),
        top: Math.min(acc.top, block.top),
        bottom: Math.max(acc.bottom, block.bottom),
      };
    },
    { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
  );

  const columns: Record<
    number,
    {
      bottom: number;
      left: number;
    }
  > = {};
  blocks.forEach((block) => {
    // If needed, use Math.round(block.left) to account for minor differences.
    const key = block.left;
    if (!columns[key] || block.bottom > columns[key].bottom) {
      columns[key] = block;
    }
  });
  const bottomPoints = Object.values(columns)
    // Sort by horizontal (left) position so the path will follow the bottom edge
    .sort((a, b) => a.left - b.left)
    .map((block) => ({ left: block.left, bottom: block.bottom }));

  const width = right - left;
  const height = bottom - top;

  const newDiv = document.createElement("div");
  newDiv.style.position = "absolute";
  newDiv.style.top = top + "px";
  newDiv.style.left = left + "px";

  newDiv.style.width = width + "px";
  newDiv.style.height = height + "px";
  newDiv.style.backgroundImage =
    "linear-gradient(to top, rgba(255, 255, 255, 0.3), transparent 50%)";
  newDiv.style.backgroundColor = "transparent";
  newDiv.style.zIndex = "1";
  newDiv.style.clipPath = "url(#bottom-clip)";

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.style.position = "absolute";
  svg.style.width = "0";
  svg.style.height = "0";

  const clipPath = document.createElementNS(svgNS, "clipPath");
  clipPath.setAttribute("id", "bottom-clip");

  let pathData = `M 0 0 `;

  let posX = 0;
  let posY = 0;
  for (let i = 0; i < bottomPoints.length; i++) {
    posY = bottomPoints[i].bottom - top;
    pathData += `V ${posY} `;
    if (i === bottomPoints.length - 1) break;
    posX = bottomPoints[i + 1].left - left;
    pathData += `H ${posX} `;
  }
  pathData += `H ${width} `;

  pathData += `V -300 `; // Close the path.
  pathData += `H -300 `;

  pathData += "Z";

  const pathElem = document.createElementNS(svgNS, "path");
  pathElem.setAttribute("d", pathData);
  clipPath.appendChild(pathElem);
  svg.appendChild(clipPath);

  // Append the SVG to newDiv so it's a child.
  newDiv.appendChild(svg);
  return newDiv;
}
