import { useEffect, useRef } from "react";
import { Action, ActionType, GameAnimation, Piece } from "../state/types";
import { getLastValidPosition, getPieceBlocksCoordinates } from "../engine";
import { useBlockSize } from "./useBlockSize";

export function useDropPieceAnimation({
  board,
  piece,
  dispatch,
  animation,
  duration = 200,
}: {
  board: string[][];
  piece: Piece;
  animation: GameAnimation | null;
  dispatch: (action: Action) => void;
  duration?: number;
}) {
  const blockSize = useBlockSize();
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

      const dropDistance = gridDistance * blockSize;

      dropAnimation(
        elements as HTMLElement[],
        dropDistance,
        duration,
        blockSize,
        () => {
          isStarted.current = false;
          dispatch({ type: ActionType.END_HARD_DROP });
        }
      );
    }
  }, [board, piece, blockSize, duration, dispatch, animation]);
}

function dropAnimation(
  elements: HTMLElement[],
  distance: number,
  duration: number,
  blockSize: number,
  callback?: () => void
) {
  let start: number | null = null;

  elements.forEach((element) => {
    element.style.opacity = "0.2";
  });

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
      Math.max(height + progress * distance, blockSize * 2) + "px";

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
          element.style.opacity = "1";
          element.style.transform = "none";
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
    const key = block.left;
    if (!columns[key] || block.bottom > columns[key].bottom) {
      columns[key] = block;
    }
  });
  const bottomPoints = Object.values(columns)
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
  pathData += `V -300 `;
  pathData += `H -300 `;
  pathData += "Z";

  const pathElem = document.createElementNS(svgNS, "path");
  pathElem.setAttribute("d", pathData);
  clipPath.appendChild(pathElem);
  svg.appendChild(clipPath);

  newDiv.appendChild(svg);
  return newDiv;
}
