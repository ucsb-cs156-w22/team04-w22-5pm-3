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
import { toast } from "react-toastify"
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

  console.log("userCommons:", userCommons);

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

    const objectToAxiosParamsBuy = ({commonsId}) => ({
      url: '/api/usercommons/buy',
      method: "PUT",
      params: {
        commonsId: commonsId,
      }
    });

    const objectToAxiosParamsSell = ({commonsId}) => ({
      url: '/api/usercommons/sell',
      method: "PUT",
      params: {
        commonsId: commonsId,
      }
    });

    const buyMutation = useBackendMutation(
      objectToAxiosParamsBuy,
      { onSuccess: () => toast("Cow Purchased")},
      // Stryker disable next-line all : hard to set up test for caching
    );
  
   const sellMutation = useBackendMutation(
      objectToAxiosParamsSell,
      { onSuccess: () => toast("Cow Sold")},
      // Stryker disable next-line all : hard to set up test for caching
    );
 
  const onBuy = () => { 
    buyMutation.mutate({commonsId});
    //console.log("onBuy called:", userCommons); 
  };
  
  const onSell = () => { 
    sellMutation.mutate({commonsId});
    //console.log("onSell called:", userCommons);
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
            <Profits userCommons={userCommons} />
          </CardGroup>
        }
      </Container>
    </BasicLayout>
  )
}