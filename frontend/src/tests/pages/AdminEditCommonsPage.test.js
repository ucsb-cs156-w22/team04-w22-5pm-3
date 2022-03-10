import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import AdminEditCommonsPage from "main/pages/AdminEditCommonsPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 1
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("AdminEditCommonsPagePage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/commons", { params: { id: 1 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {
            const {getByText, queryByTestId} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AdminEditCommonsPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await waitFor(() => expect(getByText("Edit Common")).toBeInTheDocument());
            expect(queryByTestId("EditCommonsForm-name")).not.toBeInTheDocument();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);
    
        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/commons", { params: { id: 1 } }).reply(200, {
                id: "1",
                name: '1',
                startingDate: "2018-12-01T08:30:00",
                cowPrice: "1",
                milkPrice: "1",
                startingBalance: "1"
            });
            axiosMock.onPut('/api/commons').reply(200, {
                id: "1",
                name: '2',
                cowPrice: "2",
                milkPrice: "2",
                startingBalance: "2"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AdminEditCommonsPage/>
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            
            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AdminEditCommonsPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("EditCommonsForm-startingBalance")).toBeInTheDocument());
            
            const commonsNameField = getByTestId("EditCommonsForm-name");
            const startingBalanceField = getByTestId("EditCommonsForm-startingBalance");
            const cowPriceField = getByTestId("EditCommonsForm-cowPrice");
            const milkPriceField = getByTestId("EditCommonsForm-milkPrice");
            
            expect(commonsNameField).toHaveValue("1");
            expect(startingBalanceField).toHaveValue(1);
            expect(cowPriceField).toHaveValue(1);
            expect(milkPriceField).toHaveValue(1);
        });

        test("Changes when you click Update", async () => {



            const { getByText, getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AdminEditCommonsPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await waitFor(() => expect(getByText("Edit Common")).toBeInTheDocument());

            const commonsNameField = getByTestId("EditCommonsForm-name");
            const startingBalanceField = getByTestId("EditCommonsForm-startingBalance");
            const cowPriceField = getByTestId("EditCommonsForm-cowPrice");
            const milkPriceField = getByTestId("EditCommonsForm-milkPrice");
            const submitButton = getByTestId("EditCommonsForm-submit");

            expect(commonsNameField).toHaveValue("1");
            expect(startingBalanceField).toHaveValue(1);
            expect(cowPriceField).toHaveValue(1);
            expect(milkPriceField).toHaveValue(1);

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(commonsNameField, { target: { value: "2" } })
            fireEvent.change(startingBalanceField, { target: { value: 2 } })
            fireEvent.change(cowPriceField, { target: { value: 2 } })
            fireEvent.change(milkPriceField, { target: { value: 2 } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Common Updated - id: 1 name: 2");
            expect(mockNavigate).toBeCalledWith({ "to": "/admin/displaytable" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: "1" });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: '2',
                cowPrice: 2,
                milkPrice: 2,
                startingBalance: 2
            })); // posted object

        });

       
    });
});