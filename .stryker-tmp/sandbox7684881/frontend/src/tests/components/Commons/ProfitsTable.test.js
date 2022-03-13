import { render } from "@testing-library/react";
import ProfitsTable from "main/components/Commons/ProfitsTable"; 
import profitsTableFixtures from "fixtures/profitsTableFixtures";

describe("Profits tests", () => {

    test("renders without crashing", () => {
        render(
            <ProfitsTable profits={profitsTableFixtures.threeFormattedProfits} />
        );
    });

    test("renders without crashing, no profits", () => {
        render(
            <ProfitsTable profits={[]} />
        );
    });

    test("renders properly with specified profits", () => {
        const { getByTestId } = render(
            <ProfitsTable profits={profitsTableFixtures.threeFormattedProfits} />
        );

        // Ensure headers are correct

        // Profit header
        const profit_header = getByTestId('ProfitsTable-header-profit');
        expect(profit_header).toBeInTheDocument();
        expect(typeof(profit_header.textContent)).toBe('string');
        expect(profit_header.textContent).toEqual("Profit");

        // Date header
        const date_header = getByTestId('ProfitsTable-header-date');
        expect(date_header).toBeInTheDocument();
        expect(typeof(date_header.textContent)).toBe('string');
        expect(date_header.textContent).toEqual("Date");

        // Ensure all profits and dates are equal to those specified in the fixture

        for (let i = 0; i < 3; i++) {
            // Profit
            const profit = getByTestId(`ProfitsTable-cell-row-${i}-col-profit`);
            expect(profit).toBeInTheDocument();
            expect(typeof(profit.textContent)).toBe('string');
            expect(+profit.textContent).toEqual(profitsTableFixtures.threeFormattedProfits[i].profit);

            // Date
            const date = getByTestId(`ProfitsTable-cell-row-${i}-col-date`);
            expect(date).toBeInTheDocument();
            expect(typeof(date.textContent)).toBe('string');
            expect(date.textContent).toEqual(profitsTableFixtures.threeFormattedProfits[i].date);
        }
    });

});