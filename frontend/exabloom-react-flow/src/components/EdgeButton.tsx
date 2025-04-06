import { EdgeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ButtonEdge } from "@/components/button-edge";

const AddButtonEdge = memo((props: EdgeProps) => {
  const { source, target, id } = props;
  const { getNodes, getEdges, getNode, setNodes, setEdges } = useReactFlow();
  const [showMenu, setShowMenu] = useState(false);
  const [, setSelectedNodeType] = useState<"actionNode" | "ifElseNode" | null>(
    null
  );

  const onEdgeClick = () => {
    setShowMenu(true); // Show the popup menu
  };

  const handleNodeTypeSelection = (nodeType: "actionNode" | "ifElseNode") => {
    setSelectedNodeType(nodeType);
    setShowMenu(false);

    const sourceNode = getNode(source);
    const targetNode = getNode(target);

    if (!sourceNode || !targetNode) return;

    const newNodePosition = {
      x: (sourceNode.position.x + targetNode.position.x) / 2,
      y: (sourceNode.position.y + targetNode.position.y) / 2,
    };

    const offset = 50;

    const newNode = {
      id: `node-${Date.now()}`,
      position: newNodePosition,
      data: {
        label: nodeType === "actionNode" ? "Action Node" : "If-Else Node",
      },
      type: nodeType || "default",
    };

    setNodes((nodes) => {
      return nodes
        .map((node) => {
          if (node.position.y > newNodePosition.y) {
            return {
              ...node,
              position: {
                ...node.position,
                y: node.position.y + offset,
              },
            };
          } else if (node.position.y < newNodePosition.y) {
            return {
              ...node,
              position: {
                ...node.position,
                y: node.position.y - offset,
              },
            };
          }
          return node;
        })
        .concat(newNode);
    });

    setEdges((edges) =>
      edges
        .filter((edge) => edge.id !== id)
        .concat(
          {
            id: `edge-${source}->${newNode.id}`,
            source: source,
            target: newNode.id,
            type: "buttonEdge",
          },
          {
            id: `edge-${newNode.id}->${target}`,
            source: newNode.id,
            target: target,
            type: "buttonEdge",
          }
        )
    );
    console.log(getNodes, getEdges);
  };

  return (
    <ButtonEdge {...props}>
      {!showMenu && (
        <Button onClick={onEdgeClick} size="sm" variant="outline">
          <Plus size={16} />
        </Button>
      )}
      {showMenu && (
        <div className="top-10 left-0 z-50 bg-white shadow-lg rounded-md p-3 border border-gray-200">
          <h5 className="text-center text-sm font-bold">Choose Node Type:</h5>
          <Button onClick={() => handleNodeTypeSelection("actionNode")}>
            Action Node
          </Button>
          <Button onClick={() => handleNodeTypeSelection("ifElseNode")}>
            If-Else Node
          </Button>
        </div>
      )}
    </ButtonEdge>
  );
});

export default AddButtonEdge;
