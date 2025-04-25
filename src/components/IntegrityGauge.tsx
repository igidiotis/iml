"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

export function IntegrityGauge({ score }: { score: number }) {
  const ref = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    const svg = d3.select(ref.current).attr("width", 140).attr("height", 140);
    svg.selectAll("*").remove();
    const radius = 60;
    const arc = d3
      .arc()
      .innerRadius(30)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle((score + 4) / 8 / 2 * Math.PI); // score -4..+4
    svg
      .append("g")
      .attr("transform", `translate(70,70)`)
      .append("path")
      .attr("d", arc as any)
      .attr("fill", "steelblue");
    svg
      .append("text")
      .attr("x", 70)
      .attr("y", 75)
      .attr("text-anchor", "middle")
      .text(score);
  }, [score]);
  return <svg ref={ref} />;
} 