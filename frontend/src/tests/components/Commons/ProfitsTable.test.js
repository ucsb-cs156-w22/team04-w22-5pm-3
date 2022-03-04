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
});