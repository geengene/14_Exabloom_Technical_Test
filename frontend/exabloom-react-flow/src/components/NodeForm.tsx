import { Node } from "@xyflow/react";
import { CircleX, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";

interface NodeFormProps {
  selectedNode: Node | null;
  onNodeNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tempNodeName: string;
  onDeleteNode: () => void;
  onSaveNode: () => void;
  onCloseForm: () => void;
}

export default function NodeForm({
  selectedNode,
  onNodeNameChange,
  tempNodeName,
  onDeleteNode,
  onSaveNode,
  onCloseForm,
}: NodeFormProps) {
  if (!selectedNode) return null;
  console.log(selectedNode);

  return (
    <div className="w-[400px] border-l bg-slate-100">
      <div className="flex px-5 py-1">
        <div className="flex-1">
          <h3 className="font-bold">Action</h3>
          <h5>{String(selectedNode.data.label)}</h5>
        </div>
        <CircleX
          className="mt-3 cursor-pointer"
          onClick={onCloseForm}
        ></CircleX>
      </div>
      <hr className="mb-4 border-1 border-black" />
      <div className="p-5">
        <label>
          Action Name:
          <Input
            type="text"
            value={tempNodeName}
            onChange={onNodeNameChange}
            className="mt-1 mb-8 p-2 border border-solid border-black bg-white"
          />
        </label>
        {selectedNode.type === "ifElseNode" && (
          <div className="mb-8">
            <h3>Branches</h3>
            <Button variant="ghost">
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
