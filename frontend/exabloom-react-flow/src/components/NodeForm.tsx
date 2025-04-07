import { NodeProps } from "@xyflow/react";
import { CircleX, Plus, Trash2 } from "lucide-react";
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
  onDeleteBranch: (branchId: string) => void;
  branchCount: number;
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
    onDeleteBranch,
    branchCount,
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
              <h3 className="font-bold">Branches: ({branchCount})</h3>
              {selectedNode.connectedNodes
                .filter((node) => node.type !== "elseNode")
                .map((node) => (
                  <div key={node.id} className="flex justify-center ">
                    <Input
                      value={node.data.label || ""}
                      onChange={(e) =>
                        onBranchNameChange(node.id, e.target.value)
                      }
                      className="mt-1 mb-1 mr-2 self-center bg-white"
                    />
                    <Trash2
                      className="self-center cursor-pointer"
                      onClick={() => onDeleteBranch(node.id)}
                    />
                  </div>
                ))}
              <Button variant="ghost" onClick={onAddBranch} className="">
                <Plus />
                Add Branch
              </Button>
              <h3 className="font-bold">Else</h3>
              {selectedNode.connectedNodes
                .filter((node) => node.type !== "branchNode")
                .map((node) => (
                  <div key={node.id} className="flex justify-center ">
                    <Input
                      value={node.data.label || ""}
                      onChange={(e) =>
                        onBranchNameChange(node.id, e.target.value)
                      }
                      className="mt-1 mb-1 mr-2 self-center bg-white"
                    />
                    {/* <Trash2
                      className="self-center cursor-pointer"
                      onClick={() => onDeleteBranch(node.id)}
                    /> */}
                  </div>
                ))}
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
