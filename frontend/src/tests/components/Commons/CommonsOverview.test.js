import { render } from "@testing-library/react";
import CommonsOverview from "main/components/Commons/CommonsOverview";
import { getStartDate, getEndDate } from "main/components/Commons/CommonsOverview";  
import commonsFixtures from "fixtures/commonsFixtures"; 
import moment from "moment";

describe("CommonsOverview tests", () => {

    test("renders without crashing", () => {
        const { getByTestId } = render(
            <CommonsOverview commons={commonsFixtures.oneCommons[0]} />
        );

        function test_getStartDate(timestamp) {
            return moment(timestamp).format('YYYY-MM-DD');
        }
        
        function test_getEndDate(timestamp, duration) {
            return moment(timestamp).add({days: duration+1}).format('MM/DD/YYYY');
        }

        var duration = -1;
        var currentDay = moment();
        var startDate = test_getStartDate(currentDay);
        var endDate = test_getEndDate(startDate, duration);
        currentDay = currentDay.diff(startDate, "days");
        const title = getByTestId('title');
        expect(title).toBeInTheDocument();
        expect(typeof(title.textContent)).toBe('string');
        expect(test_getStartDate(currentDay)).toEqual(getStartDate(currentDay));
        expect(test_getEndDate(startDate, duration+10)).toEqual(getEndDate(startDate, duration+10));
        expect("Today is day " + currentDay + "! This game will end on " + endDate + ".").toEqual(title.textContent);
        
    });
});