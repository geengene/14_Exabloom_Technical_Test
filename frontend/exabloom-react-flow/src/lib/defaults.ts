import ActionNode from "@/components/ActionNode";
import IfElseNode from "@/components/IfElseNode";
import AddButtonEdge from "@/components/EdgeButton";

export const defaultNodes = [
  {
    id: "start",
    type: "input",
    position: { x: 0, y: 0 },
    data: { label: "Start" },
  },
  {
    id: "end",
    type: "output",
    position: { x: 0, y: 200 },
    data: { label: "End" },
  },
];

export const defaultEdges = [
  {
    id: "start->end",
    source: "start",
    target: "end",
    type: "buttonEdge",
  },
];

export const nodeTypes = {
  actionNode: ActionNode,
  ifElseNode: IfElseNode,
};

export const edgeTypes = {
  buttonEdge: AddButtonEdge,
};
