package edu.ucsb.cs156.happiercows.controllers;

import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.ProfitRepository;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.Profit;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.http.MediaType;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import org.springframework.beans.factory.annotation.Autowired;
import edu.ucsb.cs156.happiercows.testconfig.TestConfig;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(controllers = ProfitsController.class)
@Import(TestConfig.class)
public class ProfitsControllerTests extends ControllerTestCase {

  @MockBean
  UserCommonsRepository userCommonsRepository;

  @MockBean
  UserRepository userRepository;

  @MockBean
  CommonsRepository commonsRepository;

  @MockBean
  ProfitRepository profitRepository;

  @Autowired
  private ObjectMapper objectMapper;

  @WithMockUser(roles = { "USER" })
  @Test
  public void get_profits_test() throws Exception {
    UserCommons expectedUserCommons = UserCommons.builder().id(1).commonsId(2).userId(1).build();
    Profit expectedProfit = Profit.builder().id(42L).profit(100).timestamp(12).userCommons(expectedUserCommons).build();
    when(profitRepository.findById(42L)).thenReturn(Optional.of(expectedProfit));

    MvcResult response = mockMvc.perform(get("/api/profits?id=42"))
        .andExpect(status().isOk()).andReturn();

    verify(profitRepository, times(1)).findById(42L);

    String responseString = response.getResponse().getContentAsString();
    Profit actualProfit = objectMapper.readValue(responseString, Profit.class);
    assertEquals(actualProfit, expectedProfit);
  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void get_profits_admin_test() throws Exception {
    UserCommons expectedUserCommons = UserCommons.builder().id(1).commonsId(2).userId(1).build();
    Profit expectedProfit = Profit.builder().id(42).profit(100).timestamp(12).userCommons(expectedUserCommons).build();
    when(profitRepository.findById(42L)).thenReturn(Optional.of(expectedProfit));

    MvcResult response = mockMvc.perform(get("/api/profits/admin?id=42"))
        .andExpect(status().isOk()).andReturn();

    verify(profitRepository, times(1)).findById(42L);

    String responseString = response.getResponse().getContentAsString();
    Profit actualProfit = objectMapper.readValue(responseString, Profit.class);
    assertEquals(actualProfit, expectedProfit);
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void get_profits_all_commons_test() throws Exception {
    List<Profit> expectedProfits = new ArrayList<Profit>();
    UserCommons expectedUserCommons = UserCommons.builder().id(1).commonsId(2).userId(1).build();
    Profit p1 = Profit.builder().id(42).profit(100).timestamp(12).userCommons(expectedUserCommons).build();

    expectedProfits.add(p1);
    when(profitRepository.findAllByUserCommonsId(1L)).thenReturn(expectedProfits);
    // UserCommons is associated with current user
    when(userCommonsRepository.findByCommonsIdAndUserId(2L, 1L)).thenReturn(Optional.of(expectedUserCommons));

    MvcResult response = mockMvc
        .perform(get("/api/profits/all/commons?userCommonsId=1").contentType("application/json"))
        .andExpect(status().isOk()).andReturn();

    verify(profitRepository, times(1)).findAllByUserCommonsId(1L);

    String responseString = response.getResponse().getContentAsString();
    List<Profit> actualProfits = objectMapper.readValue(responseString, new TypeReference<List<Profit>>() {
    });
    assertEquals(actualProfits, expectedProfits);
  }

}
