import { render } from "@testing-library/react";
import CommonsOverview from "main/components/Commons/CommonsOverview";
import { getNumberOfDays, getEndDate } from "main/components/Commons/CommonsOverview"; 
import commonsFixtures from "fixtures/commonsFixtures"; 

describe("CommonsOverview tests", () => {

    test("renders without crashing", () => {
        const { getByTestId } = render(
            <CommonsOverview commons={commonsFixtures.oneCommons[0]} />
        );

        function test_getNumberOfDays(start, end) {
            const date1 = new Date(start);
            const date2 = new Date(end);
        
            // One day in milliseconds
            const test_oneDay = 1000 * 60 * 60 * 24;
        
            // Calculating the time difference between two dates
            const test_diffInTime = date2.getTime() - date1.getTime();
        
            // Calculating the no. of days between two dates
            const test_diffInDays = Math.round(test_diffInTime / test_oneDay);
        
            return test_diffInDays;
        }
        
        function test_getEndDate(timestamp) {
            function test_pad(n) { return n < 10 ? '0' + n : n; }
            // Convert timestamp to JavaScript Date object
            let end = new Date(timestamp);
            // Return desired formatting (YYYY-MM-DD)
            return `${end.getUTCFullYear()}-${test_pad(end.getUTCMonth()+1)}-${test_pad(end.getUTCDate())}`;
        }

        let start, now, end = new Date();
        const title = getByTestId('title');
        expect(title).toBeInTheDocument();
        expect(typeof(title.textContent)).toBe('string');
        expect(test_getNumberOfDays(start, now)).toEqual(getNumberOfDays(start, now));
        expect(test_getEndDate(end)).toEqual(getEndDate(end));


    });
});