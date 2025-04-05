import AddButtonEdge from "../components/EdgeButton";

export const defaultNodes = [
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
export const defaultEdges = [
  {
    id: "start->end",
    source: "start",
    target: "end",
    type: "buttonedge",
  },
];
export const edgeTypes = {
  buttonedge: AddButtonEdge,
};
