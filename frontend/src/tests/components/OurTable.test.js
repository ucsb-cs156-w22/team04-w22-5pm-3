import { render, waitFor, fireEvent } from "@testing-library/react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("OurTable tests", () => {
    const threeRows = [
        {
            col1: 'Hello',
            col2: 'World',
        },
        {
            col1: 'react-table',
            col2: 'rocks',
        },
        {
            col1: 'whatever',
            col2: 'you want',
        }
    ];

    const oneRows = [
        {
            col1: 'Hello',
            col2: 'World',
        },
    ];

    const columns = [
        {
            Header: 'Column 1',
            accessor: 'col1', // accessor is the "key" in the data
        },
        {
            Header: 'Column 2',
            accessor: 'col2',
        }
    ];

    test("renders an empty table without crashing", () => {
        render(
            <OurTable columns={columns} data={[]} />
        );
    });

    test("renders a table with three rows without crashing", () => {
        render(
            <OurTable columns={columns} data={threeRows} />
        );
    });

    test("The button appears in the table", async () => {
        const clickMeCallback = jest.fn();
        columns.push(ButtonColumn("Click-button", "Click-button", clickMeCallback, "Click-button"));
        const { getByTestId, debug } = render(
            <OurTable columns={columns} data={oneRows} testid="testId" />
        );

        await waitFor(() => expect(getByTestId("Click-button-cell-row-0-col-Click-button-button")).toBeInTheDocument());
        const button = (getByTestId("Click-button-cell-row-0-col-Click-button-button"));
        // debug();
        console.log(button);
        // await waitFor(() => );
        //expect(clickMeCallback).toBeCalledTimes(1)
        //await waitFor(clickMeCallback);
        fireEvent.click(button);
        await waitFor(() => expect(clickMeCallback).toBeCalledTimes(1));
    });

    test("default testid is testId", async () => {
        const { getByTestId } = render(
            <OurTable columns={columns} data={threeRows} />
        );
        await waitFor(() => expect(getByTestId("testid-header-col1")).toBeInTheDocument());
    });

    test("click on a header and a sort caret should appear", async () => {
        const { getByTestId, getByText } = render(
            <OurTable columns={columns} data={threeRows} testid={"sampleTestId"} />
        );

        await waitFor(() => expect(getByTestId("sampleTestId-header-col1")).toBeInTheDocument());
        const col1Header = getByTestId("sampleTestId-header-col1");

        const col1SortCarets = getByTestId("sampleTestId-header-col1-sort-carets");
        expect(col1SortCarets).toHaveTextContent('');

        const col1Row0 = getByTestId("sampleTestId-cell-row-0-col-col1");
        expect(col1Row0).toHaveTextContent("Hello");

        fireEvent.click(col1Header);
        await waitFor(() => expect(getByText("🔼")).toBeInTheDocument());

        fireEvent.click(col1Header);
        await waitFor(() => expect(getByText("🔽")).toBeInTheDocument());



    });

});