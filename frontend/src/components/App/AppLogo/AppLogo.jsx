import { Image } from "@mantine/core";
import classes from "./AppLogo.module.css";
import logo from "../../../assets/icon/icon_2_dark.svg";

function AppLogo() {
  return (
    <Image
      className={classes.invert}
      src={logo}
      alt="TeamPulse Logo"
      width={30}
      height={30}
    />
  );
}

export default AppLogo;
