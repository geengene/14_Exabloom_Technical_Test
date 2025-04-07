import { Handle, Position } from "@xyflow/react";

interface IfElseNodeProps {
  data: { label?: string };
  isConnectable: boolean;
}
function IfElseNode({ data, isConnectable }: IfElseNodeProps) {
  return (
    <div className="h-fit w-fit text-wrap text-ellipsis min-w-[150px] max-w-[200px] border-2 border-black rounded-sm p-2 bg-blue-100">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <h3 className="text-center">{data.label || "If-Else Node"}</h3>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default IfElseNode;
