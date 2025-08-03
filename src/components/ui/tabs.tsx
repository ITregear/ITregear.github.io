import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { Link, useLocation } from "wouter"
import { useRef, useLayoutEffect, useState } from "react";

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export default function TabsNav() {
  const [location] = useLocation();

  // Tab definitions
  const tabs = [
    { label: "Home", href: "/" },
    { label: "Thoughts", href: "/thoughts" },
    { label: "TOP SECRET", href: "/top-secret" },
    // Add more tabs here if needed
  ];

  // Find selected tab index - handle article pages as thoughts
  const selectedIdx = tabs.findIndex(tab => {
    if (tab.href === location) return true;
    // If we're on an article page (starts with /thoughts/), treat it as thoughts
    if (tab.href === "/thoughts" && location.startsWith("/thoughts/")) return true;
    return false;
  });

  const folderTabBg = "#e2cfa5";
  const pageBg = "hsl(var(--vintage-beige))";
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [tabDims, setTabDims] = useState<{ containerWidth: number, tabs: { left: number, width: number }[] }>({
    containerWidth: 0,
    tabs: [],
  });

  useLayoutEffect(() => {
    if (tabContainerRef.current && tabRefs.current.every(Boolean)) {
      const containerRect = tabContainerRef.current.getBoundingClientRect();
      const tabsRects = tabRefs.current.map(ref => {
        if (!ref) return { left: 0, width: 0 };
        const rect = ref.getBoundingClientRect();
        return {
          left: rect.left - containerRect.left,
          width: rect.width,
        };
      });
      setTabDims({
        containerWidth: containerRect.width,
        tabs: tabsRects,
      });
    }
  }, [location, tabs.length]);

  // SVG path logic
  const tabHeight = 48; // px, matches py-3 and font size
  const angle = 60; // degrees
  const angleRad = (angle * Math.PI) / 180;
  const chamfer = tabHeight / Math.tan(angleRad); // horizontal length for 60deg
  const yBase = tabHeight + 8; // baseline for the SVG, add extra for visibility
  const svgHeight = yBase + 8;

  let path = "";
  if (tabDims.containerWidth > 0 && tabDims.tabs.length === tabs.length && selectedIdx !== -1) {
    const selected = tabDims.tabs[selectedIdx];
    const left = selected.left;
    const width = selected.width;
    // First tab
    if (selectedIdx === 0) {
      // Start at top left
      path = `M0,${yBase - tabHeight} `;
      // Flat across tab
      path += `L${left + width},${yBase - tabHeight} `;
      // Down at 60deg
      path += `L${left + width + chamfer},${yBase} `;
      // Continue baseline to right edge
      path += `L${tabDims.containerWidth},${yBase}`;
    } else if (selectedIdx === tabs.length - 1) {
      // Last tab
      // Start at left edge
      path = `M0,${yBase} `;
      // Baseline up to just before selected tab
      path += `L${left - chamfer},${yBase} `;
      // Up at 60deg
      path += `L${left},${yBase - tabHeight} `;
      // Flat across tab
      path += `L${tabDims.containerWidth},${yBase - tabHeight}`;
    } else {
      // Central tab
      // Start at left edge
      path = `M0,${yBase} `;
      // Baseline up to just before selected tab
      path += `L${left - chamfer},${yBase} `;
      // Up at 60deg
      path += `L${left},${yBase - tabHeight} `;
      // Flat across tab
      path += `L${left + width},${yBase - tabHeight} `;
      // Down at 60deg
      path += `L${left + width + chamfer},${yBase} `;
      // Continue baseline to right edge
      path += `L${tabDims.containerWidth},${yBase}`;
    }
  }

  return (
    <div className="w-full flex justify-center mb-8">
      <div className="max-w-5xl w-full mx-auto relative">
        <div
          ref={tabContainerRef}
          className="relative flex justify-between items-end w-full"
          style={{ minHeight: tabHeight + 16 }}
        >
          {tabs.map((tab, i) => (
            tab.label === "TOP SECRET" ? (
              <span
                key={tab.href}
                ref={el => tabRefs.current[i] = el as HTMLAnchorElement}
                className={`flex-1 px-2 py-3 font-typewriter text-typewriter-dark transition-all duration-150 text-lg select-none text-center opacity-60 cursor-not-allowed ${i === selectedIdx ? "text-stamp-red" : ""}`}
                style={{
                  zIndex: i === selectedIdx ? 2 : 1,
                  position: "relative",
                  border: "none",
                  borderRadius: 0,
                  background: "transparent",
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <span className="w-full text-center truncate">{tab.label}</span>
              </span>
            ) : (
              <a
                key={tab.href}
                ref={el => tabRefs.current[i] = el}
                href={tab.href}
                className={`flex-1 px-2 py-3 font-typewriter text-typewriter-dark transition-all duration-150 text-lg select-none text-center ${i === selectedIdx ? "text-stamp-red" : ""}`}
                style={{
                  zIndex: i === selectedIdx ? 2 : 1,
                  position: "relative",
                  border: "none",
                  borderRadius: 0,
                  background: "transparent",
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="w-full text-center truncate">{tab.label}</span>
              </a>
            )
          ))}
          {/* SVG underline/outline */}
          <svg
            width="100%"
            height={svgHeight}
            viewBox={`0 0 ${tabDims.containerWidth} ${svgHeight}`}
            style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 0, width: '100%' }}
            preserveAspectRatio="none"
          >
            <path
              d={path}
              stroke={folderTabBg}
              strokeWidth={4}
              fill="none"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
