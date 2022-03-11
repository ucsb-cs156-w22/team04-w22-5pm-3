import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import AdminCommonsTablePage from "main/pages/AdminCommonsTablePage";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import commonsFixtures from "fixtures/commonsFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";


const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockedNavigate(x); return null; }
    };
});

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});


describe("AdminCommonsTablePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();
    const testId = "AdminCommonsTable";


    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", async () => {

        const { getByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminCommonsTablePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => expect(getByText("Commons Table")).toBeInTheDocument());

    });


    test("renders three commons without crashing for admin user", async () => {
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/commons/all").reply(200, commonsFixtures.threeCommons);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminCommonsTablePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("5"); });
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("4");
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("1");

    });


    test("test what happens when you click delete", async () => {

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/commons/all").reply(200, commonsFixtures.threeCommons);
        axiosMock.onDelete("/api/commons/delete").reply(200, "record 5 was deleted");


        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminCommonsTablePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

       expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("5"); 


        const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
       
        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("record 5 was deleted") });

    });

});
