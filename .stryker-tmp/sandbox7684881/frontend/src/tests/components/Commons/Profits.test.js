import { render } from "@testing-library/react";
import Profits from "main/components/Commons/Profits"; 
import userCommonsFixtures from "fixtures/userCommonsFixtures"; 
import profitsFixtures from "fixtures/profitsFixtures";
import moment from "moment";

describe("Profits tests", () => {

    test("renders without crashing", () => {
        render(
            <Profits userCommons={userCommonsFixtures.oneUserCommons[0]} profits={profitsFixtures.threeProfits} />
        );
    });

    test("renders without crashing, no profits", () => {
        render(
            <Profits userCommons={userCommonsFixtures.oneUserCommons[0]} profits={[]} />
        );
    });

    test("renders properly with specified profits", () => {
        const { getByTestId } = render(
            <Profits userCommons={userCommonsFixtures.oneUserCommons[0]} profits={profitsFixtures.threeProfits} />
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
            expect(+profit.textContent).toEqual(profitsFixtures.threeProfits[i].profit);

            // Date
            const date = getByTestId(`ProfitsTable-cell-row-${i}-col-date`);
            expect(date).toBeInTheDocument();
            expect(typeof(date.textContent)).toBe('string');
            expect(date.textContent).toEqual(moment(profitsFixtures.threeProfits[i].timestamp).format('YYYY-MM-DD'));
        }
    });
});