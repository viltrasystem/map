import React, { useState, useEffect } from "react";
import { useAppSelector } from "../app/hook";
import { RootState } from "../app/store";

interface ContextMenuPosition {
  isOpen: boolean;
  x: number;
  y: number;
  unitId: number;
  userId: number;
}

function useContextMenu(ref: React.RefObject<HTMLDivElement>): {
  handleContextMenu: React.MouseEventHandler<HTMLElement>;
  contextMenuPosition: ContextMenuPosition;
} {
  const { user } = useAppSelector((state: RootState) => state.auth);

  const [contextMenuPosition, setContextMenuPosition] =
    useState<ContextMenuPosition>({
      isOpen: true,
      x: 0,
      y: 0,
      unitId: 0,
      userId: 0,
    });

  //const scrollRef = useRef<HTMLElement | null>(null); // Allow null for potential unmounted elements

  const handleContextMenu = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault(); // Prevent default context menu

    const { clientX, clientY } = event;
    const element = ref.current;

    // Check if element exists before accessing its properties
    if (element) {
      const scrollTop = element.offsetTop || 0;
      const scrollLeft = element.scrollLeft || 0;

      setContextMenuPosition({
        isOpen: true,
        x: clientX + scrollLeft,
        y: clientY + scrollTop,
        unitId: Number(event.currentTarget.id),
        userId: user.UserId,
      });
    } else {
      // Handle the case where the element is not available (e.g., during initial render)
      console.warn("Element not available for scroll position retrieval.");
    }
  };

  useEffect(() => {
    // Optional effect logic, not needed in this case
  }, []); // Empty dependency array to prevent unnecessary re-runs

  return { handleContextMenu, contextMenuPosition };
}

export default useContextMenu;
