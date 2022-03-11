import { fireEvent, render, waitFor } from "@testing-library/react";
import PlayPage from "main/pages/PlayPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({
        commonsId: 1
    })
}));

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("PlayPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios, { onNoMatch: "throwException" });
    const queryClient = new QueryClient();

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/usercommons/forcurrentuser", { params: { commonsId: 1 } }).reply(200, {
            commonsId: 1,
            id: 1,
            totalWealth: 100,
            userId: 1,
            cowHealth: 100,
            numCows: 0,
            cowPrice: 50,
        });
        axiosMock.onPost("/api/usercommons/buy").reply(200, {
            commonsId: 1,
            id: 1,
            totalWealth: 50,
            userId: 1,
            cowHealth: 51,
            numCows: 1,
            cowPrice: 50,
        });
        axiosMock.onPost("/api/usercommons/sell").reply(200, {
            commonsId: 1,
            id: 1,
            totalWealth: 70.2,
            userId: 1,
            cowHealth: 51,
            numCows: 0,
            cowPrice: 50,
        });
        axiosMock.onGet("/api/commons", { params: { id: 1 } }).reply(200, {
            id: 1,
            name: "Sample Commons"
        });
        axiosMock.onGet("/api/commons/all").reply(200, [
            {
                id: 1,
                name: "Sample Commons"
            }
        ]);
    });

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("click buy and sell buttons", async () => {

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => expect(getByTestId("buy-cow-button")).toBeInTheDocument());
        const buyCowButton = getByTestId("buy-cow-button");

        fireEvent.click(buyCowButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("Cow Purchased") });

        const sellCowButton = getByTestId("sell-cow-button");
        fireEvent.click(sellCowButton);


        await waitFor(() => { expect(mockToast).toBeCalledWith("Cow Sold") });

    });

    test("Make sure that both the Announcements and Welcome Farmer components show up", async () => {

        const { getByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor( ()=>expect(getByText(/Announcements/)).toBeInTheDocument());
        await waitFor( ()=>expect(getByText(/Welcome Farmer/)).toBeInTheDocument());
    });

});


