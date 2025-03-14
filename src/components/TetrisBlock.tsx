import { getBlockSize } from "../utils/blockSize";

export function TetrisBlock({
  id,
  color,
  isGhost,
}: {
  id?: string;
  color: string;
  isGhost?: boolean;
}) {
  const blockSize = getBlockSize();
  const blockStyle = {
    width: blockSize,
    height: blockSize,
    backgroundColor: color,
    borderColor: color,
    borderStyle: "outset",
    borderWidth: "5px",
    borderRadius: "2px",
    opacity: 1,
  };

  if (isGhost) {
    blockStyle.opacity = 0.3;
  }

  return <div id={id} style={blockStyle}></div>;
}
