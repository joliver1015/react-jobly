import React from "react";
import { render } from "@testing-library/react";
import LoginForm from "./LoginForm";
import { MemoryRouter } from "react-router";
import SignupForm from "./SignUpForm";

it("matches snapshot", function () {
    const { asFragment } = render(
        <MemoryRouter>
            <SignupForm />
        </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
})

