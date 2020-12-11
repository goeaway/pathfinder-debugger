import { render } from "@testing-library/react";
import App from "@src/components/app";
import React from "react";

it("should display a container with role 'app'", () => {
    const { getByRole } = render(<App />);
    getByRole("app");
});