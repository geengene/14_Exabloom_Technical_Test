import { Handle, Position } from "@xyflow/react";

interface ActionNodeProps {
  data: { label?: string };
  isConnectable: boolean;
}
function ActionNode({ data, isConnectable }: ActionNodeProps) {
  return (
    <div className="h-fit w-fit text-wrap text-ellipsis min-w-[150px] max-w-[150px] border-2 border-black rounded-sm p-2 bg-green-100">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <h3 className="text-center">{data.label || "Action Node"}</h3>
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

export default ActionNode;
