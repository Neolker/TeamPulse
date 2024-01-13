import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import image from '../assets/jumbotron.svg';
import classes from './Jumbotron.module.css';

export default function Jumbotron() {
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            A <span className={classes.highlight}>modern</span> Project managment <br /> aplication
          </Title>
          <Text c="dimmed" mt="md">
            Build fully functional accessible web applications faster than ever
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Javascript based</b> – build type safe applications, all components and hooks
              export types
            </List.Item>
            <List.Item>
              <b>Free and open source</b> – all packages have MIT license.
            </List.Item>
          </List>

          <Group mt={30}>
            <Button radius="xl" size="md" className={classes.control}>
              Get started
            </Button>
            <Button variant="default" radius="xl" size="md" className={classes.control}>
              Source code
            </Button>
          </Group>
        </div>
        <Image src={image} className={classes.image} />
      </div>
    </Container>
  );
}