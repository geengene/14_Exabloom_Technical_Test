import { EdgeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ButtonEdge } from "@/components/button-edge";

const AddButtonEdge = memo((props: EdgeProps) => {
  const { source, target, id } = props;
  const { getNode, setNodes, setEdges } = useReactFlow();
  const [showMenu, setShowMenu] = useState(false);
  const [, setSelectedNodeType] = useState<"actionNode" | "ifElseNode" | null>(
    null
  );

  const onEdgeClick = () => {
    setShowMenu(true);
  };

  const handleNodeTypeSelection = (nodeType: "actionNode" | "ifElseNode") => {
    setSelectedNodeType(nodeType);
    setShowMenu(false);

    const sourceNode = getNode(source);
    const targetNode = getNode(target);
    console.log(sourceNode, targetNode);

    if (!sourceNode || !targetNode) return;

    const newNodePosition = {
      x: (sourceNode.position.x + targetNode.position.x) / 2,
      y: (sourceNode.position.y + targetNode.position.y) / 2,
    };

    const offset = 100;
    const secondOffset = 200;

    if (nodeType === "ifElseNode") {
      const ifElseNode = {
        id: `node-${Date.now()}`,
        position: newNodePosition,
        data: {
          label: "If-Else Node",
        },
        type: nodeType || "default",
      };
      const ifNode = {
        id: `ifBranch-${Date.now()}`,
        position: {
          x: newNodePosition.x - secondOffset,
          y: ifElseNode.position.y + offset,
        },
        data: { label: "Branch 1" },
        type: "branchNode",
      };
      const elseNode = {
        id: `elseBranch-${Date.now()}`,
        position: {
          x: newNodePosition.x + secondOffset,
          y: ifElseNode.position.y + offset,
        },
        data: { label: "Else" },
        type: "elseNode",
      };
      const newEndNode = {
        id: `endNode-${Date.now()}`,
        position: {
          x: newNodePosition.x + secondOffset,
          y: ifElseNode.position.y + offset + secondOffset,
        },
        data: { label: "End" },
        type: "output",
      };

      setNodes((nodes) => {
        return nodes
          .map((node) => {
            if (node.position.y > newNodePosition.y) {
              if (node.position.x < newNodePosition.x) {
                return {
                  ...node,
                  position: {
                    x: node.position.x - secondOffset,
                    y: node.position.y + secondOffset,
                  },
                };
              }
              if (node.position.x > newNodePosition.x) {
                return {
                  ...node,
                  position: {
                    x: node.position.x + secondOffset,
                    y: node.position.y + secondOffset,
                  },
                };
              }
              if (node.position.x === newNodePosition.x) {
                return {
                  ...node,
                  position: {
                    x: node.position.x - secondOffset,
                    y: node.position.y + secondOffset,
                  },
                };
              }
              return {
                ...node,
                position: {
                  ...node.position,
                  y: node.position.y + secondOffset,
                },
              };
            }
            if (node.position.y < newNodePosition.y) {
              if (node.position.x > newNodePosition.x) {
                return {
                  ...node,
                  position: {
                    x: node.position.x + secondOffset,
                    y: node.position.y - offset,
                  },
                };
              }
              if (node.position.x < newNodePosition.x) {
                return {
                  ...node,
                  position: {
                    x: node.position.x - secondOffset,
                    y: node.position.y - offset,
                  },
                };
              }
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
          .concat(ifElseNode, ifNode, elseNode, newEndNode);
      });

      setEdges((edges) =>
        edges
          .filter((edge) => edge.id !== id)
          .concat(
            {
              id: `edge-${source}->${ifElseNode.id}`,
              source: source,
              target: ifElseNode.id,
              type: "buttonEdge",
            },
            {
              id: `edge-${ifElseNode.id}->${ifNode.id}`,
              source: ifElseNode.id,
              target: ifNode.id,
              type: "smoothstep",
            },
            {
              id: `edge-${ifElseNode.id}->${elseNode.id}`,
              source: ifElseNode.id,
              target: elseNode.id,
              type: "smoothstep",
            },
            {
              id: `edge-${ifNode.id}->${target}`,
              source: ifNode.id,
              target: target,
              type: "buttonEdge",
            },
            {
              id: `edge-${elseNode.id}->end-${Date.now()}`,
              source: elseNode.id,
              target: newEndNode.id,
              type: "buttonEdge",
            }
          )
      );
      return;
    }

    if (nodeType === "actionNode") {
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
    }
    return;
  };

  return (
    <ButtonEdge {...props}>
      {!showMenu && (
        <Button
          onClick={onEdgeClick}
          size="sm"
          variant="outline"
          className="p-2 rounded-full"
        >
          <Plus size={10} />
        </Button>
      )}
      {showMenu && (
        <div className="top-10 left-0 z-50 bg-white shadow-lg rounded-md p-2 border border-gray-200">
          <h5 className="text-center text-sm font-bold">Choose Node Type:</h5>
          <Button
            onClick={() => handleNodeTypeSelection("actionNode")}
            className="text-xs p-2 mr-1"
          >
            Action Node
          </Button>
          <Button
            onClick={() => handleNodeTypeSelection("ifElseNode")}
            className="text-xs p-2"
          >
            If-Else Node
          </Button>
        </div>
      )}
    </ButtonEdge>
  );
});

export default AddButtonEdge;
