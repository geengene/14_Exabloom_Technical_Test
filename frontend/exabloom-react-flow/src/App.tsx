import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
} from "@xyflow/react";
import ButtonEdgeDemo from "./components/EdgeButton";
import { DevTools } from "./components/devtools";
import "@xyflow/react/dist/style.css";
import { useCallback } from "react";

const defaultNodes = [
  {
    id: "1",
    type: "default",
    position: { x: 200, y: 200 },
    data: { label: "Start" },
  },
  {
    id: "2",
    type: "default",
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
  const [nodes, , onNodesChange] = useNodesState([...defaultNodes]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([...defaultEdges]);
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );
  return (
    <div className="w-screen h-screen p-8">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <DevTools position="top-left" />
      </ReactFlow>
    </div>
  );
}
