import { Fragment } from "react";
import {
  Category,
  Component,
  Variant,
  Palette,
} from "@react-buddy/ide-toolbox";
import Button from "@mui/material/Button";

export const PaletteTree = () => (
  <Palette>
    <Category name="App">
      <Component name="Loader">
        <Variant>
          <ExampleLoaderComponent />
        </Variant>
      </Component>
    </Category>
    <Category name="Material">
      <Component name="Button">
        <Variant>
          <Button />
        </Variant>
      </Component>
    </Category>
  </Palette>
);

export function ExampleLoaderComponent() {
  return <Fragment>Loading...</Fragment>;
}
