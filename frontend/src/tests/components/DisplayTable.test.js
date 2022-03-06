import { render } from "@testing-library/react";
import DisplayTable from "main/components/DisplayTable";
import commonsFixtures from "fixtures/commonsFixtures";

describe("AdminDisplayTable tests", () => {
    const dummyData = [
        { name: 1, startingbalance: 1, cowprice: "1", milkprice: "1", startdate: "1", enddate: "1" },
    ];
    test("renders without crashing", () => {
        render(
            <DisplayTable commons={commonsFixtures.oneCommons} />
        );
    });
});