import { Node } from "@xyflow/react";
import { CircleX } from "lucide-react";
import { Button } from "./ui/button";

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

  return (
    <div className="w-[400px] p-5 border-l bg-slate-100">
      <div className="flex">
        <h3 className="mb-8 font-bold flex-1">Edit Node</h3>
        <CircleX className="cursor-pointer" onClick={onCloseForm}></CircleX>
      </div>
      <label>
        Action Name:
        <input
          type="text"
          value={tempNodeName}
          onChange={onNodeNameChange}
          className="w-full mt-1 mb-8 p-2 border border-solid border-black"
        />
      </label>
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
  );
}
