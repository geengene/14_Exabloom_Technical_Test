import { EdgeProps, useReactFlow } from "@xyflow/react";
import { memo } from "react";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ButtonEdge } from "@/components/button-edge";

const ButtonEdgeDemo = memo((props: EdgeProps) => {
  const { source, target, id } = props; // Extract edge properties
  const { getNode, setNodes, setEdges } = useReactFlow(); // Access React Flow state

  const onEdgeClick = () => {
    const sourceNode = getNode(source); // Get source node
    const targetNode = getNode(target); // Get target node

    if (!sourceNode || !targetNode) return;

    // Calculate the midpoint between source and target nodes
    const newNodePosition = {
      x: (sourceNode.position.x + targetNode.position.x) / 2,
      y: (sourceNode.position.y + targetNode.position.y) / 2,
    };

    // Create a new node
    const newNode = {
      id: `node-${Date.now()}`, // Unique ID for the new node
      position: newNodePosition,
      data: { label: "New Node" },
      type: "default",
    };

    // Update nodes and edges
    setNodes((nodes) => [...nodes, newNode]);
    setEdges((edges) =>
      edges
        .filter((edge) => edge.id !== id) // Remove the current edge
        .concat(
          // Add two new edges connecting the new node
          { id: `edge-${source}-${newNode.id}`, source, target: newNode.id },
          { id: `edge-${newNode.id}-${target}`, source: newNode.id, target }
        )
    );
  };

  return (
    <ButtonEdge {...props}>
      <Button onClick={onEdgeClick} size="sm" variant="outline">
        <Plus size={16} />
      </Button>
    </ButtonEdge>
  );
});

export default ButtonEdgeDemo;
