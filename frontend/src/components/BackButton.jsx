import { useNavigate } from "react-router-dom";
import { ActionIcon } from "@mantine/core";
import { IconArrowBack } from "@tabler/icons-react";

function BackButton() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <ActionIcon variant="outline" color="yellow" aria-label="step back" size="lg" m="md" onClick={goBack}>
      <IconArrowBack style={{ width: "70%", height: "70%" }} stroke={1.5} />
    </ActionIcon>
  );
}

export default BackButton;
