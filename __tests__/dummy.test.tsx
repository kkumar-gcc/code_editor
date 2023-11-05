import {render, screen} from "@testing-library/react";

it('should have Dummy text', function () {
    render(<div>Dummy</div>);

    const myElement = screen.getByText(/Dummy/i);

    expect(myElement).toBeInTheDocument();
});