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

});


