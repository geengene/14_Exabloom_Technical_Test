import { Background, ReactFlow } from "@xyflow/react";
import ButtonEdgeDemo from "./components/EdgeButton";
import "@xyflow/react/dist/style.css";

const defaultNodes = [
  {
    id: "1",
    position: { x: 200, y: 200 },
    data: { label: "Start" },
  },
  {
    id: "2",
    position: { x: 500, y: 500 },
    data: { label: "End" },
  },
];

const defaultEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "buttonedge",
  },
];

const edgeTypes = {
  buttonedge: ButtonEdgeDemo,
};

export default function App() {
  return (
    <div className="w-screen h-screen p-8">
      <ReactFlow
        defaultNodes={defaultNodes}
        defaultEdges={defaultEdges}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
