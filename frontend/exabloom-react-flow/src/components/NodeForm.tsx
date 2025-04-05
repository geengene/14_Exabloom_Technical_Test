export default function NodeForm({
  selectedNode,
  onNodeNameChange,
  onDeleteNode,
}) {
  if (!selectedNode) return null; // Don't render the form if no node is selected

  return (
    <div className="w-[300px] p-5 border-l bg-slate-100">
      <h3 className="mb-8 font-bold">Edit Node</h3>
      <label>
        Node Name:
        <input
          type="text"
          value={selectedNode.data.label}
          onChange={onNodeNameChange}
          className="w-full mt-1 mb-8 p-2 border border-solid border-black"
        />
      </label>
      <button
        onClick={onDeleteNode}
        className="bg-red-500 text-white p-[10px] cursor-pointer border-none"
      >
        Delete Node
      </button>
    </div>
  );
}
