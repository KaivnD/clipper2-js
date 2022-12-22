import Konva from "konva";
import React from "react";
import { useEffect, useState } from "react";
import { Layer, Stage, Rect } from "react-konva";
import PolygonAnnotation from "./PolygonAnnotation";

interface ShapeEditorProps {
  pts?: number[][];
}

export const ShapeEditor = ({ pts }: ShapeEditorProps) => {
  const windowSize = useWindowSize();
  const [points, setPoints] = useState<number[][]>(
    pts?.map((item) => [item[0], windowSize.height - item[1]]) ?? []
  );
  const [flipYPoints, setFlipYPoints] = useState<number[][]>([]);
  const [flattenedPoints, setFlattenedPoints] = useState<number[][]>();
  const [position, setPosition] = useState([0, 0]);
  const [isMouseOverPoint, setMouseOverPoint] = useState(false);
  const [isPolyComplete, setPolyComplete] = useState(Boolean(pts));
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setFlipYPoints(
      points.map((item) => [item[0], windowSize.height - item[1]])
    );
  }, [points]);

  const getMousePos = (stage: Konva.Stage) => {
    const pos = stage.getPointerPosition();
    if (!pos) throw new Error("can not get pointer position");
    return [pos.x, pos.y];
  };
  //drawing begins when mousedown event fires.
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (isPolyComplete || !stage || e.evt.button === 2) return;

    const mousePos = getMousePos(stage);
    if (isMouseOverPoint && points.length >= 3) {
      setPolyComplete(true);
    } else {
      setPoints([...points, mousePos]);
    }
  };
  const handleMouseMove = (e: { target: { getStage: () => any } }) => {
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);
    setPosition(mousePos);
  };
  const handleMouseOverStartPoint = (e: {
    target: { scale: (arg0: { x: number; y: number }) => void };
  }) => {
    if (isPolyComplete || points.length < 3) return;
    e.target.scale({ x: 1.2, y: 1.2 });
    setMouseOverPoint(true);
  };
  const handleMouseOutStartPoint = (e: {
    target: { scale: (arg0: { x: number; y: number }) => void };
  }) => {
    e.target.scale({ x: 1, y: 1 });
    setMouseOverPoint(false);
  };
  const handlePointDragMove = (e: {
    target: {
      getStage: () => any;
      index: number;
      _lastPos: { x: any; y: any };
    };
  }) => {
    const stage = e.target.getStage();
    const index = e.target.index - 1;
    const pos = [e.target._lastPos.x, e.target._lastPos.y];
    if (pos[0] < 0) pos[0] = 0;
    if (pos[1] < 0) pos[1] = 0;
    if (pos[0] > stage.width()) pos[0] = stage.width();
    if (pos[1] > stage.height()) pos[1] = stage.height();
    setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)]);
  };

  useEffect(() => {
    return setFlattenedPoints(
      points
        .concat(isPolyComplete ? [] : position)
        .reduce<number[][]>((a, b) => a.concat(b), [])
    );
  }, [points, isPolyComplete, position]);

  const undo = () => {
    setPoints(points.slice(0, -1));
    setPolyComplete(false);
    setPosition(points[points.length - 1]);
  };

  const reset = () => {
    setPoints([]);
    setPolyComplete(false);
  };

  const handleGroupDragEnd = (e: {
    target: {
      name: () => string;
      x: () => string | number;
      y: () => string | number;
      position: (arg0: { x: number; y: number }) => void;
    };
  }) => {
    //drag end listens other children circles' drag end event
    //...that's, why 'name' attr is added, see in polygon annotation part
    if (e.target.name() === "polygon") {
      let result: number[][] = [];
      let copyPoints = [...points];
      copyPoints.forEach((point) => {
        if (!e.target) return;
        result.push([
          point[0] + parseFloat(e.target.x().toString()),
          point[1] + parseFloat(e.target.y().toString()),
        ]);
      });
      e.target.position({ x: 0, y: 0 }); //needs for mouse position otherwise when click undo you will see that mouse click position is not normal:)
      setPoints(result);
    }
  };
  return (
    <Stage
      width={windowSize.width}
      height={windowSize.height}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => {
        e.evt.preventDefault();
        undo();
      }}
    >
      <Layer>
        <Rect
          x={0}
          y={0}
          fill="transparent"
          width={windowSize.width}
          height={windowSize.height}
          onMouseDown={() => setEdit(false)}
        />
        <PolygonAnnotation
          edit={edit || !isPolyComplete}
          points={points}
          flattenedPoints={flattenedPoints}
          handlePointDragMove={handlePointDragMove}
          handleGroupDragEnd={handleGroupDragEnd}
          handleMouseOverStartPoint={handleMouseOverStartPoint}
          handleMouseOutStartPoint={handleMouseOutStartPoint}
          isFinished={isPolyComplete}
          handleMouseDown={(e) => {
            e.evt.stopPropagation();
            setEdit(true);
          }}
        />
      </Layer>
    </Stage>
  );
};

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  });
  const resizeHandler = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  };
  return windowSize;
}
