import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
} from "@xyflow/react";
import { DevTools } from "./components/devtools";
import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";
import NodeForm from "./components/NodeForm";
import {
  defaultNodes,
  defaultEdges,
  nodeTypes,
  edgeTypes,
} from "./lib/defaults";

export interface NodeFormProps {
  selectedNode: any;
  tempNodeName: string;
  onNodeNameChange: (e: any) => void;
  onDeleteNode: () => void;
  onSaveNode: () => void;
  onCloseForm: () => void; // Add the missing property
}

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([...defaultNodes]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([...defaultEdges]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [tempNodeName, setTempNodeName] = useState("");

  const onConnect: OnConnect = useCallback(
    (connection) =>
      setEdges((edges) =>
        addEdge({ ...connection, type: "buttonEdge" }, edges)
      ),
    [setEdges]
  );

  const onNodeClick = (event: object, node) => {
    console.log(event, node);
    setSelectedNode(node); // Set the clicked node as the selected node
    setTempNodeName(node.data.label || ""); // Initialize the temporary name with the node's label
    // TODO: if no node selected, close the form
  };

  const onNodeNameChange = (e) => {
    const newName = e.target.value;
    setTempNodeName(newName); // Update the temporary name
  };

  const onSaveNode = () => {
    if (!selectedNode) return;

    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === selectedNode.id
          ? {
              ...node,
              data: {
                ...node.data,
                label: tempNodeName || "", // Update the label with the temporary name
              },
            }
          : node
      )
    );

    // Update the selectedNode's label to reflect the change
    setSelectedNode((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        label: tempNodeName || "",
      },
    }));
  };

  const onDeleteNode = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== selectedNode.id));
    setEdges(
      (edges) =>
        edges.filter(
          (edge) =>
            edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      //TODO: connect the nodes that were connected to the deleted Node
    );
    setSelectedNode(null);
  };

  const onCloseForm = () => {
    setSelectedNode(null);
  };

  return (
    <div className="flex">
      <div className="w-screen h-screen p-8 flex-1">
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
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
        tempNodeName={tempNodeName}
        onNodeNameChange={onNodeNameChange}
        onDeleteNode={onDeleteNode}
        onSaveNode={onSaveNode}
        onCloseForm={onCloseForm}
      />
    </div>
  );
}
