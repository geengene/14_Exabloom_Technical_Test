import { Handle, Position } from "@xyflow/react";

interface ElseNodeProps {
  data: { label?: string };
  isConnectable: boolean;
}
function ElseNode({ data, isConnectable }: ElseNodeProps) {
  return (
    <div className="h-fit w-fit text-wrap text-ellipsis min-w-[150px] max-w-[150px] border-2 border-gray-400 rounded-3xl p-2 bg-gray-200">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <h3 className="text-center">{data.label || "Else"}</h3>
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

export default ElseNode;
