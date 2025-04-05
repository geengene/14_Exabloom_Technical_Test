export default function NodeForm({
  selectedNode,
  onNodeNameChange,
  onDeleteNode,
}) {
  if (!selectedNode) return null; // Don't render the form if no node is selected

  return (
    <div
      style={{
        width: "300px",
        padding: "20px",
        borderLeft: "1px solid #ddd",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3>Edit Node</h3>
      <label>
        Node Name:
        <input
          type="text"
          value={selectedNode.data.label}
          onChange={onNodeNameChange}
          style={{ width: "100%", marginTop: "10px", marginBottom: "10px" }}
        />
      </label>
      <button
        onClick={onDeleteNode}
        style={{
          backgroundColor: "red",
          color: "white",
          border: "none",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        Delete Node
      </button>
    </div>
  );
}
