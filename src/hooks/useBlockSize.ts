import { useState, useEffect } from "react";

export function useBlockSize() {
  const getBlockSize = () => {
    if (window.matchMedia("(max-height: 37.5rem)").matches) {
      return 16;
    }
    if (window.matchMedia("(max-height: 45rem)").matches) {
      return 20;
    }
    if (window.matchMedia("(max-width: 48rem)").matches) {
      return 26;
    }
    return 32;
  };

  const [blockSize, setBlockSize] = useState(getBlockSize);

  useEffect(() => {
    const updateBlockSize = () => setBlockSize(getBlockSize());

    const mediaQueries = [
      window.matchMedia("(max-height: 37.5rem)"),
      window.matchMedia("(max-height: 45rem)"),
      window.matchMedia("(max-width: 48rem)"),
    ];

    mediaQueries.forEach((mq) =>
      mq.addEventListener("change", updateBlockSize)
    );

    return () => {
      mediaQueries.forEach((mq) =>
        mq.removeEventListener("change", updateBlockSize)
      );
    };
  }, []);

  return blockSize;
}
