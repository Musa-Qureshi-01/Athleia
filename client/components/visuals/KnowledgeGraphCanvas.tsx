"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: "hub" | "node" | "satellite";
  connections: number[];
  pulsePhase: number;
}

export function KnowledgeGraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initNodes();
    };

    const initNodes = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const nodes: Node[] = [];

      // Create hub nodes (major knowledge zones)
      const hubs = [
        { x: w * 0.5, y: h * 0.45 },
        { x: w * 0.22, y: h * 0.3 },
        { x: w * 0.78, y: h * 0.3 },
        { x: w * 0.3, y: h * 0.72 },
        { x: w * 0.7, y: h * 0.72 },
      ];

      hubs.forEach((pos, i) => {
        nodes.push({
          x: pos.x,
          y: pos.y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          radius: i === 0 ? 5 : 3.5,
          type: i === 0 ? "hub" : "node",
          connections: i === 0 ? [1, 2, 3, 4] : [0],
          pulsePhase: Math.random() * Math.PI * 2,
        });
      });

      // Satellite nodes
      for (let i = 0; i < 14; i++) {
        const parentIdx = Math.floor(Math.random() * hubs.length);
        const parent = hubs[parentIdx];
        const angle = Math.random() * Math.PI * 2;
        const dist = 55 + Math.random() * 70;
        nodes.push({
          x: parent.x + Math.cos(angle) * dist,
          y: parent.y + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          radius: 1.5 + Math.random() * 1.5,
          type: "satellite",
          connections: [parentIdx],
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }

      nodesRef.current = nodes;
    };

    const getThemeColors = () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      return {
        nodePrimary: isDark ? "rgba(248, 250, 252, 0.9)" : "rgba(15, 23, 42, 0.85)",
        nodeSecondary: isDark ? "rgba(148, 163, 184, 0.6)" : "rgba(71, 85, 105, 0.5)",
        edgeColor: isDark ? "rgba(30, 35, 51, 0.9)" : "rgba(226, 232, 240, 1)",
        accentColor: isDark ? "rgba(59, 130, 246, 0.7)" : "rgba(37, 99, 235, 0.6)",
        pulseColor: isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(37, 99, 235, 0.1)",
      };
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const nodes = nodesRef.current;
      const t = timeRef.current;
      const colors = getThemeColors();

      ctx.clearRect(0, 0, w, h);

      // Draw edges
      nodes.forEach((node) => {
        node.connections.forEach((targetIdx) => {
          if (targetIdx >= nodes.length) return;
          const target = nodes[targetIdx];
          const dx = target.x - node.x;
          const dy = target.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Pulse along edge
          const pulseProgress = ((t * 0.0008 + node.pulsePhase) % 1);
          const pulseX = node.x + dx * pulseProgress;
          const pulseY = node.y + dy * pulseProgress;

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = colors.edgeColor;
          ctx.lineWidth = node.type === "hub" ? 0.75 : 0.5;
          ctx.stroke();

          // Traveling pulse dot
          if (dist < 200) {
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = colors.accentColor;
            ctx.fill();
          }
        });
      });

      // Draw nodes
      nodes.forEach((node) => {
        const pulse = Math.sin(t * 0.001 + node.pulsePhase) * 0.5 + 0.5;

        if (node.type === "hub" || node.type === "node") {
          // Subtle glow ring
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 4 + pulse * 3, 0, Math.PI * 2);
          ctx.fillStyle = colors.pulseColor;
          ctx.fill();
        }

        // Node fill
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle =
          node.type === "hub"
            ? colors.accentColor
            : node.type === "node"
            ? colors.nodePrimary
            : colors.nodeSecondary;
        ctx.fill();
      });

      // Update positions (gentle drift within bounds)
      const margin = 60;
      nodesRef.current = nodes.map((node) => {
        let { x, y, vx, vy } = node;
        x += vx;
        y += vy;
        if (x < margin || x > w - margin) vx *= -1;
        if (y < margin || y > h - margin) vy *= -1;
        x = Math.max(margin, Math.min(w - margin, x));
        y = Math.max(margin, Math.min(h - margin, y));
        return { ...node, x, y, vx, vy };
      });

      timeRef.current += 16;
      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}
