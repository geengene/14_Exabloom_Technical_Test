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
      setEdges(
        (edges) => addEdge({ ...connection, type: "buttonEdge" }, edges) // sets all edges to be ButtonEdge
      ),
    [setEdges]
  );

  const onNodeClick = (event, node) => {
    if (node.type !== "actionNode" && node.type !== "ifElseNode") {
      // cant access NodeForm for anything but actionNode and ifElseNode types
      return event.preventDefault();
    }
    console.log(event, node);
    setSelectedNode(node); // sets clicked node as the selected node
    setTempNodeName(node.data.label || ""); // init temporary name with the node's label
    // TODO: if no node selected, close the form
  };

  const onNodeNameChange = (e) => {
    const newName = e.target.value;
    setTempNodeName(newName);
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
                label: tempNodeName || "", // update label with temporary name
              },
            }
          : node
      )
    );

    setSelectedNode((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        label: tempNodeName || "",
      },
    }));
  };

  const onDeleteNode = () => {
    if (!selectedNode) return;
    setNodes((nodes) => nodes.filter((node) => node.id !== selectedNode.id));
    setEdges((edges) => {
      // edges connected to the deleted node
      const connectedEdges = edges.filter(
        (edge) =>
          edge.source === selectedNode.id || edge.target === selectedNode.id
      );

      const sourceEdge = connectedEdges.find(
        (edge) => edge.target === selectedNode.id
      );
      const targetEdge = connectedEdges.find(
        (edge) => edge.source === selectedNode.id
      );

      // remove edges connected to the deleted node
      const updatedEdges = edges.filter(
        (edge) =>
          edge.source !== selectedNode.id && edge.target !== selectedNode.id
      );

      // create a new edge between source and target handles
      if (sourceEdge && targetEdge) {
        const newEdge = {
          id: `edge-${sourceEdge.source}-${targetEdge.target}`,
          source: sourceEdge.source,
          target: targetEdge.target,
          type: "buttonEdge",
        };
        return [...updatedEdges, newEdge];
      }

      return updatedEdges;
    });
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
          onNodeClick={onNodeClick}
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
