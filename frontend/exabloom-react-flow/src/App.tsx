import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
} from "@xyflow/react";
import AddButtonEdge from "./components/EdgeButton";
import { DevTools } from "./components/devtools";
import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";
import NodeForm from "./components/NodeForm";

const defaultNodes = [
  {
    id: "start",
    type: "default",
    position: { x: 0, y: 0 },
    data: { label: "Start" },
  },
  {
    id: "end",
    type: "default",
    position: { x: 0, y: 200 },
    data: { label: "End" },
  },
];
const defaultEdges = [
  {
    id: "start->end",
    source: "start",
    target: "end",
    type: "buttonedge",
  },
];
const edgeTypes = {
  buttonedge: AddButtonEdge,
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([...defaultNodes]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([...defaultEdges]);
  const [selectedNode, setSelectedNode] = useState(null); // Track selected node

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  const onNodeClick = (event, node) => {
    console.log(event, node);
    setSelectedNode(node); // Set the clicked node as the selected node
    // TODO: if no node selected, close the form
  };

  const onNodeNameChange = (e) => {
    const newName = e.target.value;

    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newName || "", // Update the label with the new name
            },
          };
        } else {
          return node;
        }
      })
    );

    // Update the selectedNode's label to reflect the change immediately
    setSelectedNode((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        label: newName || "",
      },
    }));
  };

  const onDeleteNode = () => {
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== selectedNode.id && edge.target !== selectedNode.id
      )
    );
    setSelectedNode(null); // Clear the selected node
  };

  return (
    <div className="flex">
      <div className="w-screen h-screen p-8 flex-1">
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick} // Handle node click
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
          <DevTools position="top-left" />
        </ReactFlow>
      </div>
      <NodeForm
        selectedNode={selectedNode}
        onNodeNameChange={onNodeNameChange}
        onDeleteNode={onDeleteNode}
      />
    </div>
  );
}
