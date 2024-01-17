import { Box, Button, Group, Select, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

export function CompanyDetailsForm({
  company,
  isEditing,
  awid,
  users,
  update,
  create,
  superadmin,
}) {
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      owner_id: "",
    },

    validate: {
      name: (value) => (!value ? "Name is required" : null),
      description: (value) => (!value ? "Description is required" : null),
      owner_id: (value) => (!value ? "Owner ID is required" : null),
    },
  });

  useEffect(() => {
    if (isEditing && awid && company) {
      form.setValues({ ...company });
    }
  }, [awid, isEditing, company]);

  const handleSubmit = (values) => {
    if (isEditing) {
      update(values);
    } else {
      create(values);
    }
  };

  const userOptions = users?.map((user) => ({
    value: user.id,
    label: user.email, // Adjust according to your user object structure
  }));

  return (
    <Box style={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Name" {...form.getInputProps("name")} />
        <Textarea label="Description" {...form.getInputProps("description")} />
        {superadmin ? (
          <Select
            label="Owner"
            placeholder="Select owner"
            data={userOptions}
            searchable
            {...form.getInputProps("owner_id")}
          />
        ) : (
          ""
        )}

        <Group position="right" mt="md">
          <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
        </Group>
      </form>
    </Box>
  );
}
