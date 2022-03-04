import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import React from "react";
import { useCurrentUser } from "main/utils/currentUser";
import CommonsPlay from "main/components/Commons/CommonsPlay";
import { useParams } from "react-router-dom";
import CommonsOverview from "main/components/Commons/CommonsOverview";
import { Container, CardGroup } from "react-bootstrap";
import ManageCows from "main/components/Commons/ManageCows";
import FarmStats from "main/components/Commons/FarmStats";
import Profits from "main/components/Commons/Profits";
import { useBackend } from "main/utils/useBackend";
import { useBackendMutation } from "main/utils/useBackend";
import axios from "axios";

export default function PlayPage() {

  const { commonsId } = useParams();
  const { data: currentUser } = useCurrentUser();

  const { data: userCommons, error: userCommonsError, status: userCommonsStatus } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/usercommons/forcurrentuser?commonsId=${commonsId}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: "/api/usercommons/forcurrentuser",
        params: {
          commonsId: commonsId
        }
      }
    );

  const { data: commons, error: commonsError, status: commonsStatus } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/commons?commons_id=${commonsId}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: "/api/commons",
        params: {
          id: commonsId
        }
      }
    );

  const { data: userCommonsProfits, error: userCommonsProfitsError, status: userCommonsProfitsStatus } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/profits/all/commons?userCommonsId=${commonsId}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: "/api/profits/all/commons",
        params: {
          userCommonsId: commonsId
        }
      }
    );

    const objectToAxiosParams = (commonsId, wealth) => ({
      url: "/api/usercommons/GetWealth",
      method: "POST",
      params: {
        commonsId: commonsId,
        wealth: wealth
      }
    });

    const mutation = useBackendMutation(
      objectToAxiosParams,
      { onSuccess: () => toast("yay!")},
      // Stryker disable next-line all : hard to set up test for caching
      [`/api/usercommons/GetWealth?commonsId=${commonsId}&wealth=${wealth}`]
    );
 
  const onBuy = (userCommons) => { 
    mutation.mutate(commonsId, -10);
    console.log("onBuy called:", userCommons); 
  };
  
  const onSell = (userCommons) => { 
    mutation.mutate(commonsId, 10);
    console.log("onSell called:", userCommons);
  };

  return (
    
    <BasicLayout >
      <Container >
        { !!currentUser &&  <CommonsPlay currentUser={currentUser} /> }
        { !!commons && <CommonsOverview commons={commons} />}
        <br />
        { !!userCommons &&
          <CardGroup >
            <ManageCows userCommons={userCommons} onBuy={onBuy} onSell={onSell} />
            <FarmStats userCommons={userCommons} />
            <Profits userCommons={userCommons} profits={userCommonsProfits} />
          </CardGroup>
        }
      </Container>
    </BasicLayout>
  )
}