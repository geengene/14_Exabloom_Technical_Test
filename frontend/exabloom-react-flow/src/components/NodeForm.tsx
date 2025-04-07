import { Node, NodeProps } from "@xyflow/react";
import { CircleX, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { memo } from "react";

interface NodeFormProps {
  selectedNode: NodeProps | null;
  onNodeNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tempNodeName: string;
  onDeleteNode: () => void;
  onSaveNode: () => void;
  onCloseForm: () => void;
  onAddBranch: () => void;
  connectedNodes?: NodeProps[];
  onBranchNameChange: (branchId: string, newName: string) => void;
}

const NodeForm = memo(
  ({
    selectedNode,
    onNodeNameChange,
    tempNodeName,
    onDeleteNode,
    onSaveNode,
    onCloseForm,
    onAddBranch,
    onBranchNameChange,
  }: NodeFormProps) => {
    if (!selectedNode) return null;

    return (
      <div className="w-[400px] border-l bg-slate-100">
        <div className="flex px-5 py-1">
          <div className="flex-1">
            <h1 className="font-bold text-lg">Action</h1>
            <h3>{String(selectedNode.type)}</h3>
          </div>
          <CircleX
            className="mt-3 cursor-pointer"
            onClick={onCloseForm}
          ></CircleX>
        </div>
        <hr className="mb-4 border-1 border-black" />
        <div className="p-5">
          <label>
            <h3 className="font-bold">Action Name:</h3>
            <Input
              type="text"
              value={tempNodeName}
              onChange={onNodeNameChange}
              className="mt-1 mb-8 p-2 border border-solid border-black bg-white"
            />
          </label>
          {selectedNode.type === "ifElseNode" && (
            <div className="mb-8">
              <h3 className="font-bold">Branches</h3>
              {selectedNode.connectedNodes.map((node) => (
                <div key={node.id}>
                  <Input
                    value={node.data.label || "Unnamed Node"}
                    onChange={(e) =>
                      onBranchNameChange(node.id, e.target.value)
                    }
                    className="mb-2"
                  />
                </div>
              ))}
              <Button variant="ghost" onClick={onAddBranch}>
                <Plus />
                Add Branch
              </Button>
            </div>
          )}
          <div className="flex justify-between items-center">
            <Button variant="destructive" onClick={onDeleteNode}>
              Delete
            </Button>
            <div className="flex space-x-1">
              <Button variant="ghost" onClick={onCloseForm}>
                Cancel
              </Button>
              <Button className="bg-green-500" onClick={onSaveNode}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default NodeForm;
