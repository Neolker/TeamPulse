import {
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import React, { useState, useEffect } from "react";
import TaskFormModal from "./Forms/TaskFormModal";
import { useCompany } from "./CompanyContext";

export default function TasksTab({
  user,
  users,
  tasks,
  isCompanyOwner,
  workspaceUsers,
  workspaceId,
}) {
  const { createTask, updateTask, taskStatusOptions } = useCompany();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);

  useEffect(() => {
    if (tasks) {
      setTotalTasks(tasks.length);
      setPendingTasks(tasks.filter((task) => task.status === "0").length);
      setCompletedTasks(tasks.filter((task) => task.status === "2").length);
    }
  }, [tasks]);

  const openNewTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCreateTask = (values) => {
    createTask({ ...values, session: user.session, workspace_id: workspaceId });
  };
  const handleUpdateTask = (values) => {
    updateTask({ ...values, session: user.session });
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  return (
    <>
      {tasks.length === 0 ? (
        <Group justify="center" mt="md">
          <Text>No tasks</Text>
        </Group>
      ) : (
        <Group mt="md" justify="space-between">
          <Badge size="lg">Total: {totalTasks}</Badge>
          <Badge size="lg" color="yellow">
            Pending: {pendingTasks}
          </Badge>
          <Badge size="lg" color="blue">
            In progress: {totalTasks - pendingTasks - completedTasks}
          </Badge>
          <Badge size="lg" color="green">
            Done: {completedTasks}
          </Badge>

          {isCompanyOwner && (
            <Button mb="md" radius="md" onClick={openNewTaskModal}>
              Create New Task
            </Button>
          )}
        </Group>
      )}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 2, xl: 3 }}>
        {tasks.map((task) => {
          const solver = workspaceUsers?.find((user) => user.id === task.solver_id);
          const status = taskStatusOptions.find(
            (option) => option.value === task.status
          );
          return (
            <Card key={task.id} shadow="sm" p="lg" m="sm" radius="md">
              <Stack>
                <Title order={3}>{task.name}</Title>
                <Group>
                  <Badge color="orange" size="lg">
                    {formatDate(task.deadline)}
                  </Badge>
                  <Badge size="lg" color={status.color}>{status.label}</Badge>
                </Group>
                <Badge variant="light" color={solver.roles[0]?.color}>
                  {solver.label}
                </Badge>
                <Text>{task.description}</Text>

                <Button
                  onClick={() => openEditTaskModal(task)}
                  mt="md"
                  radius="md"
                >
                  Edit
                </Button>
              </Stack>
            </Card>
          );
        })}
      </SimpleGrid>
      <TaskFormModal
        opened={isTaskModalOpen}
        setOpened={setIsTaskModalOpen}
        task={editingTask}
        users={workspaceUsers}
        createTask={(values) => handleCreateTask(values)}
        updateTask={(values) => handleUpdateTask(values)}
      />
    </>
  );
}
