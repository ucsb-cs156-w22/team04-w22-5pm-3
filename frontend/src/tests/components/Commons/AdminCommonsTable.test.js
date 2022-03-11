import { render } from "@testing-library/react";
import AdminCommonsTable from "main/components/Commons/AdminCommonsTable";
import commonsFixtures from "fixtures/commonsFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

describe("AdminCommonsTable tests", () => {
    const queryClient = new QueryClient();

    test("renders without crashing for empty table for admin", () => {
        const currentUser = currentUserFixtures.adminUser;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminCommonsTable commons={[]} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>

        );
    });

    test("Has the expected colum headers and content for adminUser", () => {

        const currentUser = currentUserFixtures.adminUser;

        const { getByText, getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminCommonsTable commons={commonsFixtures.threeCommons} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>

        );

        const expectedHeaders = ["ID#", "Name", "Starting Balance", "Cow Price", "Milk Price", "Start Date"];
        const expectedFields = ["id", "startingBalance", "cowPrice", "milkPrice", "startingDate"];
        const testId = "AdminCommonsTable";

        expectedHeaders.forEach((headerText) => {
            const header = getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("5");
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("4");
    });
});