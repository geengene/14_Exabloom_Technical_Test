import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  ReactFlowProvider,
  Node,
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
  selectedNode: Node;
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

  const getConnectedNodes = (nodeId: string) => {
    const connectedEdges = edges.filter((edge) => edge.source === nodeId); // all edges where the node is the source

    const connectedNodeIds = connectedEdges.map((edge) => edge.target); // id of the connected nodes

    const connectedNodes = nodes.filter(
      (node) => connectedNodeIds.includes(node.id) // find actual nodes using their IDs
    );

    return connectedNodes;
  };

  const onNodeClick = (event, node) => {
    if (node.type !== "actionNode" && node.type !== "ifElseNode") {
      // cant access NodeForm for anything but actionNode and ifElseNode types
      return event.preventDefault();
    }
    const connectedNodes = getConnectedNodes(node.id);

    setSelectedNode({ ...node, connectedNodes });
    setTempNodeName(node.data.label || "");
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

  const onAddBranch = () => {
    if (!selectedNode || selectedNode.type !== "ifElseNode") return;

    const newBranchNode = {
      id: `branch-${Date.now()}`,
      position: {
        x: selectedNode.position.x,
        y: selectedNode.position.y + 100, // position below the ifElseNode
      },
      data: { label: "New Branch" },
      type: "branchNode",
    };

    setNodes((nodes) =>
      nodes
        .map((node) => {
          if (node.position.x < newBranchNode.position.x) {
            return {
              ...node,
              position: {
                ...node.position,
                x: node.position.x - 200, // Move node 100px to the left
              },
            };
          }
          // else if (node.position.x > newBranchNode.position.x) {
          //   return {
          //     ...node,
          //     position: {
          //       ...node.position,
          //       x: node.position.x + 100,
          //     },
          //   };
          // }
          else if (
            node.position.x === newBranchNode.position.x &&
            node.type === "branchNode" &&
            !(node.position.y < newBranchNode.position.y)
          ) {
            return {
              ...node,
              position: {
                ...node.position,
                x: node.position.x - 200,
              },
            };
          }
          return node;
        })
        .concat(newBranchNode)
    );

    setEdges((edges) => [
      ...edges,
      {
        id: `edge-${selectedNode.id}-${newBranchNode.id}`,
        source: selectedNode.id,
        target: newBranchNode.id,
        type: "smoothstep",
      },
    ]);

    setSelectedNode((prev) => ({
      ...prev,
      connectedNodes: [...(prev.connectedNodes || []), newBranchNode],
    }));
  };

  const onBranchNameChange = (branchId: string, newName: string) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === branchId
          ? { ...node, data: { ...node.data, label: newName } }
          : node
      )
    );
    setSelectedNode((prev) => ({
      ...prev,
      connectedNodes: prev.connectedNodes.map((node) =>
        node.id === branchId
          ? { ...node, data: { ...node.data, label: newName } }
          : node
      ),
    }));
  };

  return (
    <ReactFlowProvider>
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
          onAddBranch={onAddBranch}
          onBranchNameChange={onBranchNameChange}
        />
      </div>
    </ReactFlowProvider>
  );
}
