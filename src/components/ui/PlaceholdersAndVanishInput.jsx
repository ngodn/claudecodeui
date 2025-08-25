"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { cn } from "../../lib/utils";

export const PlaceholdersAndVanishInput = forwardRef(({
  placeholders,
  onChange,
  onSubmit,
  onKeyDown,
  onFocus,
  onBlur,
  onPaste,
  onClick,
  onInput,
  value,
  className,
  inputClassName,
  buttonClassName,
  disabled = false,
  multiline = false,
  rows = 1,
  maxRows = 10,
  leftActions,
  rightActions,
  showSubmitButton = true,
  submitButtonContent,
  autoResize = false,
  ...props
}, ref) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const intervalRef = useRef(null);
  const startAnimation = () => {
    if (placeholders && placeholders.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
      }, 3000);
    }
  };
  
  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation();
    }
  };

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [placeholders]);

  const canvasRef = useRef(null);
  const newDataRef = useRef([]);
  const inputRef = useRef(null);
  const [animating, setAnimating] = useState(false);

  // Expose input ref to parent
  useImperativeHandle(ref, () => inputRef.current);

  const draw = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const computedStyles = getComputedStyle(inputRef.current);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    
    // Handle multiline text for canvas
    const text = value || '';
    const lines = text.split('\n');
    lines.forEach((line, index) => {
      ctx.fillText(line, 16, 40 + (index * fontSize * 2.2));
    });

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData = [];

    for (let t = 0; t < 800; t++) {
      let i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        let e = i + 4 * n;
        if (
          pixelData[e] !== 0 &&
          pixelData[e + 1] !== 0 &&
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3],
            ],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  // Auto-resize functionality
  useEffect(() => {
    if (autoResize && multiline && inputRef.current) {
      const textarea = inputRef.current;
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
      const maxHeight = lineHeight * maxRows;
      
      textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
      
      // Check if expanded (more than initial rows)
      const isCurrentlyExpanded = scrollHeight > lineHeight * rows;
      setIsExpanded(isCurrentlyExpanded);
    }
  }, [value, autoResize, multiline, maxRows, rows]);

  const animate = (start) => {
    const animateFrame = (pos = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color: color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setAnimating(false);
        }
      });
    };
    animateFrame(start);
  };

  const handleKeyDownInternal = (e) => {
    // Call custom onKeyDown first
    if (onKeyDown) {
      onKeyDown(e);
    }
    
    // Only handle Enter for submission if not prevented
    if (e.key === "Enter" && !e.defaultPrevented && !animating && !disabled) {
      if (!multiline || (!e.shiftKey && !e.ctrlKey && !e.metaKey)) {
        e.preventDefault();
        vanishAndSubmit();
      }
    }
  };

  const vanishAndSubmit = () => {
    if (!value?.trim() || animating || disabled) return;
    
    setAnimating(true);
    draw();

    const inputValue = value || '';
    if (inputValue && inputRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0
      );
      animate(maxX);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!disabled && !animating) {
      vanishAndSubmit();
      onSubmit && onSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    if (!animating && !disabled) {
      onChange && onChange(e);
    }
  };

  const handleInputEvent = (e) => {
    if (onInput) {
      onInput(e);
    }
  };

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <form
      className={cn(
        "w-full relative bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200",
        multiline && isExpanded && "rounded-2xl",
        multiline && !isExpanded && "rounded-full h-12 sm:h-14",
        !multiline && "h-12 rounded-full",
        value && "bg-gray-50 dark:bg-zinc-700",
        className
      )}
      onSubmit={handleSubmit}
      {...props}
    >
      <canvas
        className={cn(
          "absolute pointer-events-none text-base transform scale-50 top-[20%] left-2 sm:left-8 origin-top-left filter invert dark:invert-0 pr-20 z-40",
          !animating ? "opacity-0" : "opacity-100"
        )}
        ref={canvasRef}
      />
      
      {/* Left actions */}
      {leftActions && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-50 flex items-center gap-1">
          {leftActions}
        </div>
      )}
      
      <InputComponent
        onChange={handleInputChange}
        onKeyDown={handleKeyDownInternal}
        onFocus={onFocus}
        onBlur={onBlur}
        onPaste={onPaste}
        onClick={onClick}
        onInput={handleInputEvent}
        ref={inputRef}
        value={value}
        disabled={disabled}
        rows={multiline ? rows : undefined}
        className={cn(
          "w-full relative text-sm sm:text-base z-30 border-none dark:text-white bg-transparent text-black focus:outline-none focus:ring-0 transition-all duration-200",
          multiline ? [
            "resize-none overflow-y-auto py-3 sm:py-4 min-h-[40px] sm:min-h-[56px]",
            leftActions ? "pl-12 sm:pl-16" : "pl-4 sm:pl-6",
            rightActions || showSubmitButton ? "pr-16 sm:pr-20" : "pr-4 sm:pr-6"
          ] : [
            "h-full rounded-full",
            leftActions ? "pl-12 sm:pl-16" : "pl-4 sm:pl-10",
            rightActions || showSubmitButton ? "pr-16 sm:pr-20" : "pr-4 sm:pr-6"
          ],
          animating && "text-transparent dark:text-transparent",
          disabled && "cursor-not-allowed opacity-60",
          inputClassName
        )}
        style={multiline ? { maxHeight: `${maxRows * 1.5}rem` } : undefined}
      />

      {/* Right actions */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-50 flex items-center gap-1">
        {rightActions}
        {showSubmitButton && (
          <button
            disabled={!value?.trim() || disabled || animating}
            type="submit"
            className={cn(
              "h-8 w-8 sm:h-10 sm:w-10 rounded-full disabled:bg-gray-100 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-zinc-800 transition duration-200 flex items-center justify-center",
              buttonClassName
            )}
          >
            {submitButtonContent || (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white h-4 w-4 sm:h-5 sm:w-5 transform rotate-90"
              >
                <motion.path
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  initial={{
                    pathLength: 0.5,
                    opacity: 0.5,
                  }}
                  animate={{
                    pathLength: value?.trim() ? 1 : 0.5,
                    opacity: value?.trim() ? 1 : 0.5,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                />
              </motion.svg>
            )}
          </button>
        )}
      </div>

      {/* Animated placeholders */}
      <div className={cn(
        "absolute inset-0 flex items-center pointer-events-none z-20",
        multiline ? "items-start pt-3 sm:pt-4" : "items-center"
      )}>
        <AnimatePresence mode="wait">
          {!value && placeholders && placeholders.length > 0 && (
            <motion.p
              initial={{
                y: 5,
                opacity: 0,
              }}
              key={`current-placeholder-${currentPlaceholder}`}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -15,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "linear",
              }}
              className={cn(
                "dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 text-left w-[calc(100%-2rem)] truncate",
                leftActions ? "pl-12 sm:pl-16" : "pl-4 sm:pl-10"
              )}
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
});
