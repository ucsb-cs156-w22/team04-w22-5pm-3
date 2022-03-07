import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import AdminDisplayTablePage from "main/pages/AdminDisplayTablePage";
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


describe("AdminDisplayTablePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();
    const testId = "DisplayTable";


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
                    <AdminDisplayTablePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => expect(getByText("Admin Display Table Page")).toBeInTheDocument());

    });


    test("renders three commons without crashing for admin user", async () => {
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/commons/all").reply(200, commonsFixtures.threeCommons);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminDisplayTablePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("5"); });
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("4");
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("1");

    });


    // test("renders empty table when backend unavailable", async () => {

    //     const queryClient = new QueryClient();
    //     axiosMock.onGet("/api/commons/all").timeout();

    //     const restoreConsole = mockConsole();

    //     const { queryByTestId } = render(
    //         <QueryClientProvider client={queryClient}>
    //             <MemoryRouter>
    //                 <AdminDisplayTablePage />
    //             </MemoryRouter>
    //         </QueryClientProvider>
    //     );

    //     await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

    //     const errorMessage = console.error.mock.calls[0][0];
    //     expect(errorMessage).toMatch("Error communicating with backend via GET on /api/commons/all");
    //     restoreConsole();

    //     expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    // });

    test("test what happens when you click delete", async () => {

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/commons/all").reply(200, commonsFixtures.threeCommons);
        axiosMock.onDelete("/api/commons/delete").reply(200, "record 5 was deleted");


        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminDisplayTablePage />
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

    // test("When you fill in form and click submit, the right things happens", async () => {

    //     axiosMock.onPost("/api/commons/new").reply(200, {
    //         "id": 5,
    //         "name": "Seths Common",
    //         "day": 5,
    //         "endDate": "6/11/2021",
    //         "totalPlayers": 50,
    //         "cowPrice": 15,
    //     });

    //     const { getByText, getByLabelText, getByTestId } = render(
    //         <QueryClientProvider client={queryClient}>
    //             <MemoryRouter>
    //                 <AdminCreateCommonsPage />
    //             </MemoryRouter>
    //         </QueryClientProvider>
    //     );

    //     await waitFor(() => expect(getByText("Create Commons")).toBeInTheDocument());

    //     const commonsNameField = getByLabelText("Commons Name");
    //     const startingBalanceField = getByLabelText("Starting Balance");
    //     const cowPriceField = getByLabelText("Cow Price");
    //     const milkPriceField = getByLabelText("Milk Price");
    //     const startingDateField = getByLabelText("Start Date");
    //     const button = getByTestId("CreateCommonsForm-Create-Button");


    //     fireEvent.change(commonsNameField, { target: { value: 'My New Commons' } })
    //     fireEvent.change(startingBalanceField, { target: { value: '500' } })
    //     fireEvent.change(cowPriceField, { target: { value: '10' } })
    //     fireEvent.change(milkPriceField, { target: { value: '5' } })
    //     fireEvent.change(startingDateField, { target: { value: '2022-05-12' } })
    //     fireEvent.click(button);

    //     await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    //     const expectedCommons = {
    //         name: "My New Commons",
    //         startingBalance: 500,
    //         cowPrice: 10,
    //         milkPrice: 5,
    //         startingDate: '2022-05-12T00:00:00.000Z'
    //     };

    //     expect(axiosMock.history.post[0].data).toEqual(JSON.stringify(expectedCommons));
    // });

});
