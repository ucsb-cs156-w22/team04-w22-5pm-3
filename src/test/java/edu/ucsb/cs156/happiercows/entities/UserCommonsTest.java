package edu.ucsb.cs156.happiercows.entities;

import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.junit.jupiter.api.Assertions.assertEquals;


public class UserCommonsTest {
  @MockBean
  UserCommonsRepository userCommonsRepository;

  @Test
  public void getCowSellingPrice() throws Exception {
    UserCommons userCommons = UserCommons.builder().id(1L).commonsId(1L).userId(1L).numCows(1).totalWealth(100).cowPrice(10).cowHealth(50).build();
    double expectedResult = 4;
    double actualResult = userCommons.getCowSellingPrice();
    assertEquals(expectedResult, actualResult);
  }
}
