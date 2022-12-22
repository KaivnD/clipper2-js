import Konva from "konva";
import React, { useState } from "react";
import { Line, Circle, Group } from "react-konva";
import { minMax, dragBoundFunc } from "./utils";

interface PolygonAnnotationProps {
  points: number[][];
  edit: boolean;
  flattenedPoints: any;
  isFinished: any;
  handlePointDragMove: any;
  handleGroupDragEnd: any;
  handleMouseOverStartPoint: any;
  handleMouseOutStartPoint: any;
  handleMouseDown(evt: Konva.KonvaEventObject<MouseEvent>): void;
}

const PolygonAnnotation = ({
  edit,
  points,
  flattenedPoints,
  isFinished,
  handlePointDragMove,
  handleGroupDragEnd,
  handleMouseOverStartPoint,
  handleMouseOutStartPoint,
  handleMouseDown,
}: PolygonAnnotationProps) => {
  const vertexRadius = 6;

  const [stage, setStage] = useState<Konva.Stage>();
  const handleGroupMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isFinished) return;
    const stg = e.target.getStage();
    if (!stg) return;
    setStage(stg);
  };

  const [minMaxX, setMinMaxX] = useState([0, 0]); //min and max in x axis
  const [minMaxY, setMinMaxY] = useState([0, 0]); //min and max in y axis
  const handleGroupDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    let arrX = points.map((p) => p[0]);
    let arrY = points.map((p) => p[1]);
    setMinMaxX(minMax(arrX));
    setMinMaxY(minMax(arrY));
  };
  const groupDragBound = (pos: Konva.Vector2d) => {
    if (!stage) throw new Error("can not found stage");
    let { x, y } = pos;
    const sw = stage.width();
    const sh = stage.height();
    if (minMaxY[0] + y < 0) y = -1 * minMaxY[0];
    if (minMaxX[0] + x < 0) x = -1 * minMaxX[0];
    if (minMaxY[1] + y > sh) y = sh - minMaxY[1];
    if (minMaxX[1] + x > sw) x = sw - minMaxX[1];
    return { x, y };
  };
  return (
    <Group
      name="polygon"
      // draggable={isFinished}
      onDragStart={handleGroupDragStart}
      onDragEnd={handleGroupDragEnd}
      dragBoundFunc={groupDragBound}
      onMouseOver={handleGroupMouseOver}
      onMouseDown={handleMouseDown}
    >
      <Line
        points={flattenedPoints}
        stroke="#333"
        strokeWidth={3}
        closed={isFinished}
        fill="#ededed88"
      />
      {edit &&
        points.map((point, index) => {
          const x = point[0];
          const y = point[1];
          const startPointAttr =
            index === 0
              ? {
                  hitStrokeWidth: 12,
                  onMouseOver: handleMouseOverStartPoint,
                  onMouseOut: handleMouseOutStartPoint,
                }
              : null;
          return (
            <Circle
              key={index}
              x={x}
              y={y}
              radius={vertexRadius}
              fill="#fff"
              stroke="#666"
              strokeWidth={2}
              draggable
              onDragMove={handlePointDragMove}
              dragBoundFunc={(pos) => {
                if (!stage) throw new Error("stage is not defined");
                return dragBoundFunc(
                  stage.width(),
                  stage.height(),
                  vertexRadius,
                  pos
                );
              }}
              {...startPointAttr}
            />
          );
        })}
    </Group>
  );
};

export default PolygonAnnotation;
