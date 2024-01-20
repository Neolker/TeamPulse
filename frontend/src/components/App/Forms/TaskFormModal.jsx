import Reac, { useEffect } from "react";
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Select,
  Group,
} from "@mantine/core";
import { DateInput, DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useCompany } from "../CompanyContext";
export default function TaskFormModal({
  opened,
  setOpened,
  task,
  users,
  createTask,
  updateTask,
}) {
  const { taskStatusOptions } = useCompany();

  const form = useForm({
    initialValues: {
      name: task?.name || "",
      description: task?.description || "",
      solver_id: task?.solver_id || "",
      status: task?.status.toString() || "0",
      deadline: task?.deadline ? new Date(task.deadline) : new Date(),
    },

    validate: {
      name: (value) => (value ? null : "Task name is required"),
      description: (value) => (value ? null : "Description is required"),
      status: (value) => (value ? null : "Status is required"),
      deadline: (value) => (value ? null : "Deadline is required"),
      solver_id: (value) => (value ? null : "Solver is required"),
    },
  });

  useEffect(() => {
    form.setInitialValues({
      name: task?.name || "",
      description: task?.description || "",
      solver_id: task?.solver_id || "",
      status: task?.status.toString() || "0",
      deadline: task?.deadline ? new Date(task.deadline) : new Date(),
    });
    if (task) {
      form.setInitialValues({
        ...task,
        deadline: task.deadline ? new Date(task.deadline) : new Date(),
      });
      form.setValues({
        ...task,
        deadline: task.deadline ? new Date(task.deadline) : new Date(),
      });
    } else {
      form.reset();
    }
  }, [task]);

  const handleSave = (values) => {
    if (task) {
      updateTask(values);
    } else {
      createTask(values);
    }
    console.log(values);
    setOpened(false);
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setOpened(false);
        form.reset();
      }}
      title={task ? "Edit Task" : "Create New Task"}
    >
      <form
        onSubmit={form.onSubmit((values) => {
          handleSave(values);
        })}
      >
        <TextInput
          label="Task Name"
          {...form.getInputProps("name")}
          withAsterisk
        />
        <Textarea
          label="Description"
          withAsterisk
          {...form.getInputProps("description")}
        />
        <Select
          label="Solver"
          data={users}
          allowDeselect={false}
          withAsterisk
          {...form.getInputProps("solver_id")}
        />
        <Select
          label="Status"
          data={taskStatusOptions}
          {...form.getInputProps("status")}
          allowDeselect={false}
          withAsterisk
        />
        <DateTimePicker
          minDate={new Date()}
          label="Deadline"
          placeholder="Deadline"
          valueFormat="DD/MM/YYYY HH:mm"
          {...form.getInputProps("deadline")}
          withAsterisk
        />
        <Group justify="flex-end">
          <Button type="submit" mt="md" disabled={!form.isDirty()}>
            {task ? "Update Task" : "Create Task"}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
