import { EdgeProps } from "@xyflow/react";
import { memo } from "react";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ButtonEdge } from "@/components/button-edge";

const ButtonEdgeDemo = memo((props: EdgeProps) => {
  const onEdgeClick = () => {
    window.alert(`Edge has been clicked!`);
  };

  return (
    <ButtonEdge {...props}>
      <Button onClick={onEdgeClick} size="sm" variant="outline">
        <Plus size={16} />
      </Button>
    </ButtonEdge>
  );
});

export default ButtonEdgeDemo;
