import { act, render, screen, waitFor , fireEvent} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditCommonsForm from "main/components/Commons/EditCommonsForm";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("EditCommonsForm tests", () => {

    test("renders correctly ", async () => {

        const { getByText } = render(
            <Router  >
                <EditCommonsForm />
            </Router>
        );
        await waitFor(() => expect(getByText(/Commons Name/)).toBeInTheDocument());
    });
    test("Test that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId } = render(
            <Router  >
                <EditCommonsForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("CommonsForm-cancel")).toBeInTheDocument());
        const cancelButton = getByTestId("CommonsForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });
});


