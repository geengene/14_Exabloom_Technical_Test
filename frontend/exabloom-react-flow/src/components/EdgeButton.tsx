import { EdgeProps, useReactFlow } from "@xyflow/react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ButtonEdge } from "@/components/button-edge";

const AddButtonEdge = memo((props: EdgeProps) => {
  //memo compares difference between old and new EdgeProp and component will not execute if same
  const { source, target, id } = props; // https://reactflow.dev/api-reference/types/edge-props extract edge properties, provides source of edges
  const { getNode, setNodes, setEdges } = useReactFlow();

  const onEdgeClick = () => {
    const sourceNode = getNode(source);
    const targetNode = getNode(target);
    console.log(sourceNode, targetNode);

    if (!sourceNode || !targetNode) return null;

    // midpoint between source and target
    const newNodePosition = {
      x: (sourceNode.position.x + targetNode.position.x) / 2,
      y: (sourceNode.position.y + targetNode.position.y) / 2,
    };

    const offset = 50;
    // const updatedSourceNode = {
    //   ...sourceNode,
    //   position: {
    //     x: sourceNode.position.x,
    //     y: sourceNode.position.y - offset,
    //   },
    // };
    // const updatedTargetNode = {
    //   ...targetNode,
    //   position: {
    //     x: targetNode.position.x,
    //     y: targetNode.position.y + offset,
    //   },
    // };

    const newNode = {
      id: `node-${Date.now()}`,
      position: newNodePosition,
      data: { label: "New Action Node" },
      type: "default",
    };

    setNodes((nodes) => {
      return nodes
        .map((node) => {
          if (node.position.y > newNodePosition.y) {
            //if current node in the iteration is below than newNode, move it down
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
        .concat(newNode); // Add the new node
    }); // TODO: change the position of old nodes to make space for new one

    setEdges((edges) =>
      edges
        .filter((edge) => edge.id !== id) // remove the current edge
        .concat(
          // add two new edges
          {
            id: `edge-${source}->${newNode.id}`,
            source: source, // the original source of where original edge is connected to
            target: newNode.id, // connects to edge of newNode
            type: "buttonedge",
          },
          {
            id: `edge-${newNode.id}->${target}`,
            source: newNode.id,
            target: target,
            type: "buttonedge",
          }
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

export default AddButtonEdge;
