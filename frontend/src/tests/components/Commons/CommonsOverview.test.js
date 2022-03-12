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
            const oneDay = 1000 * 60 * 60 * 24;
        
            // Calculating the time difference between two dates
            const diffInTime = date2.getTime() - date1.getTime();
        
            // Calculating the no. of days between two dates
            const diffInDays = Math.round(diffInTime / oneDay);
        
            return diffInDays;
        }
        
        function test_getEndDate(timestamp) {
            function pad(n) { return n < 10 ? '0' + n : n; }
            // Convert timestamp to JavaScript Date object
            let end = new Date(timestamp);
            // Return desired formatting (YYYY-MM-DD)
            return `${end.getUTCFullYear()}-${pad(end.getUTCMonth()+1)}-${pad(end.getUTCDate())}`;
        }

        var start, end, now = new Date();
        var result = getNumberOfDays(start, now);
        var endDate = getEndDate(end);
        const title = getByTestId('title');
        expect(title).toBeInTheDocument();
        expect(typeof(title.textContent)).toBe('string');
        expect(test_getNumberOfDays(start, now)).toEqual(getNumberOfDays(start, now));
        expect(test_getEndDate(end)).toEqual(getEndDate(end));
        expect("Today is day " + result + "! This game will end on " + endDate + ".").toEqual(title.textContent);


    });
});