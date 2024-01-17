import { Button, Container, Text, TextInput, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import classes from "./Register.module.css";

export function Register() {
  return (
    <Container mt="lg">
      <div className={classes.wrapper}>
        <div className={classes.body}>
          <Title className={classes.title}>Join us now !!</Title>
          <Text fw={500} fz="lg" mb={5}>
            Contact your company owner or leave email down below and we will
            contact you as soon as possible.
          </Text>
          <Text fz="sm" c="dimmed">
            You also will never miss important product updates, latest news and
            community QA sessions. Our newsletter is once a week, every Sunday.
          </Text>

          <div className={classes.controls}>
            <TextInput
              placeholder="Your email"
              classNames={{ input: classes.input, root: classes.inputWrapper }}
            />
            <Button className={classes.control}>Submit</Button>
          </div>
        </div>
        <Button component={Link} to="/">
          Home
        </Button>
        {/* <Image src={image.src} className={classes.image} /> */}
      </div>
    </Container>
  );
}
