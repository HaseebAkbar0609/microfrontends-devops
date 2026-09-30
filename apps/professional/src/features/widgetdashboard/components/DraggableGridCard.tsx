"use client";
import React, { useRef, useState } from "react";
import Draggable, { DraggableEvent } from "react-draggable";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { WidgetCardVariant } from "../types/dashboard";

interface DraggableGridCardProps {
  className?: string;
  isSwapTarget?: boolean;
  disabled?: boolean;
  cancel?: string;
  onDragStart: () => void;
  onDrag: (clientX: number, clientY: number) => void;
  onDragStop: (clientX: number, clientY: number) => void;
  containerRef: (el: HTMLDivElement | null) => void;
  isHighlighted?: boolean;
  isEmpty?: boolean;
  /** `muted`: the grey card surface, kept while the card is highlighted. */
  variant?: WidgetCardVariant;
  children: React.ReactNode;
}

export const DraggableGridCard = ({
  className,
  isSwapTarget,
  disabled,
  cancel = "a, button, [role='button'], input, textarea, select, .no-drag",
  onDragStart,
  onDrag,
  onDragStop,
  containerRef,
  isHighlighted,
  isEmpty,
  variant = "default",
  children,
}: DraggableGridCardProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [dragKey, setDragKey] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isMuted = variant === "muted";

  const handleStart = () => {
    if (disabled) return false;
    setIsDragging(true);
    onDragStart();
  };

  const handleDrag = (e: DraggableEvent) => {
    if (disabled) return;
    const { clientX, clientY } = e as MouseEvent;
    onDrag(clientX, clientY);
  };

  const handleStop = (e: DraggableEvent) => {
    if (disabled) return;
    const { clientX, clientY } = e as MouseEvent;
    setIsDragging(false);
    onDragStop(clientX, clientY);
    setDragKey((k) => k + 1);
  };

  return (
    <Draggable
      key={dragKey}
      disabled={disabled}
      cancel={cancel}
      nodeRef={nodeRef as React.RefObject<HTMLElement>}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div
        ref={(el) => {
          (nodeRef as React.MutableRefObject<HTMLDivElement | null>).current =
            el;
          containerRef(el);
        }}
        className={`${
          className ?? ""
        } transition-[box-shadow,background-color,ring-color,border-color,transform] duration-150 h-full flex flex-col ${
          isDragging
            ? "bg-[#1E293B] text-white shadow-2xl cursor-grabbing ring-1 ring-white/10 rounded-lg !transition-none [&_*]:!bg-transparent [&_*]:!text-white [&_*]:!border-none"
            : isSwapTarget
            ? "bg-slate-50/80 border-2 border-dashed border-slate-300 rounded-lg min-h-35 shadow-inner"
            : isHighlighted
            ? isMuted
              ? "ring-4 ring-blue-500 ring-offset-2 bg-slate-100 rounded-sm scale-[1.02] shadow-xl z-9997"
              : "ring-4 ring-blue-500 ring-offset-2 rounded-lg scale-[1.02] shadow-xl z-9997"
            : isEmpty
            ? `bg-transparent border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-lg ${disabled ? "cursor-default" : "cursor-grab"}`
            : isMuted
            ? `bg-[#F1F5F9] dark:bg-slate-800/80 rounded-md transition-all ${disabled ? "cursor-default" : "cursor-grab"}`
            : `bg-white border border-slate-200/80 rounded-lg shadow-xs hover:shadow-md hover:border-slate-300 transition-all ${disabled ? "cursor-default" : "cursor-grab"}`
        }`}
        style={{
          position: "relative",
          zIndex: isDragging
            ? 9998
            : isHighlighted
            ? 9997
            : isSwapTarget
            ? 10
            : "auto",
        }}
      >
        {isSwapTarget && !isDragging ? (
          <div className="flex flex-col items-center justify-center h-full min-h-35 text-slate-400 font-medium gap-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-10 h-10 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center animate-pulse">
              <div className="w-4 h-4 bg-slate-200 rounded-sm" />
            </div>
            <span className="text-xs tracking-wider uppercase text-secondary">
              <Translate text={localizationConstants.placeHere} />
            </span>
          </div>
        ) : (
          <div
            className={`transition-transform duration-150 h-full flex-1 flex flex-col ${
              isDragging ? "scale-95" : ""
            }`}
          >
            {children}
          </div>
        )}
      </div>
    </Draggable>
  );
};
