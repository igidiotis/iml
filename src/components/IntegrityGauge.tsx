"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

export function IntegrityGauge({ score }: { score: number }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Gauge configuration
    const width = 300;
    const height = 150;
    const radius = Math.min(width, height) / 1.5;
    const centerX = width / 2;
    const centerY = height / 1.2;

    // Score scale ranges from -3 to +3
    const scoreScale = d3
      .scaleLinear()
      .domain([-3, 3])
      .range([-Math.PI / 2, Math.PI / 2]);

    // Gauge background
    const arc = d3
      .arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    // Color scale for the gauge
    const colorScale = d3
      .scaleLinear<string>()
      .domain([-3, 0, 3])
      .range(["#f87171", "#d1d5db", "#34d399"]);

    // Draw gauge background
    svg
      .append("path")
      .datum({ endAngle: Math.PI / 2 })
      .attr("d", arc as any)
      .attr("fill", "#e5e7eb")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    // Calculate score angle
    const scoreAngle = scoreScale(Math.max(-3, Math.min(3, score)));

    // Determine needle length
    const needleLength = radius * 0.8;

    // Draw gauge needle
    svg
      .append("line")
      .attr("x1", centerX)
      .attr("y1", centerY)
      .attr("x2", centerX + needleLength * Math.cos(scoreAngle))
      .attr("y2", centerY + needleLength * Math.sin(scoreAngle))
      .attr("stroke", colorScale(score))
      .attr("stroke-width", 4)
      .attr("stroke-linecap", "round");

    // Draw gauge center
    svg
      .append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", 8)
      .attr("fill", "#4b5563");

    // Draw score text
    svg
      .append("text")
      .attr("x", centerX)
      .attr("y", centerY + 40)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .attr("fill", colorScale(score))
      .text(`Score: ${score}`);

  }, [score]);

  return (
    <div className="flex justify-center">
      <svg ref={svgRef} width="300" height="150"></svg>
    </div>
  );
} 