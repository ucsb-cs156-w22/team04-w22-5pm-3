package edu.ucsb.cs156.happiercows.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(controllers = UserCommonsController.class)
@Slf4j
public class UserCommonsControllerTests extends ControllerTestCase {

  @MockBean
  UserCommonsRepository userCommonsRepository;

  @MockBean
  UserRepository userRepository;

  @MockBean
  CommonsRepository commonsRepository;

  @Autowired
  private ObjectMapper objectMapper;


  @WithMockUser(roles = { "USER","ADMIN" })
  @Test
  public void BuyTestWhenExists() throws Exception {
    UserCommons userCommons = UserCommons.builder().id(1L).commonsId(1L).userId(1L).numCows(1).totalWealth(100).cowPrice(10).cowHealth(0).build();
    when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L),eq(1L))).thenReturn(Optional.of(userCommons));
    UserCommons expectedUserCommons = UserCommons.builder().id(1L).commonsId(1L).userId(1L).numCows(2).totalWealth(90).cowPrice(10).cowHealth(0.5).build();

    MvcResult response = mockMvc
        .perform(post("/api/usercommons/buy?commonsId=1").with(csrf()))
        .andExpect(status().isOk()).andReturn();

    String responseString = response.getResponse().getContentAsString();
    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(eq(1L),eq(1L));
    UserCommons actualUserCommons = objectMapper.readValue(responseString, UserCommons.class);
    assertEquals(expectedUserCommons, actualUserCommons);
  }

  @WithMockUser(roles = { "USER","ADMIN" })
  @Test
  public void BuyTestWhenNotExists() throws Exception {

    when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L),eq(1L))).thenReturn(Optional.empty());
    MvcResult response = mockMvc
        .perform(post("/api/usercommons/buy?commonsId=1").with(csrf()))
        .andExpect(status().is(404)).andReturn();

    String responseString = response.getResponse().getContentAsString();
    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(eq(1L),eq(1L));
    ObjectMapper om = new ObjectMapper();
    String expectedError = "{\"type\":\"EntityNotFoundException\",\"message\":\"UserCommons with commonsId 1 and userId 1 not found\"}";
    Map<String, Object> m1 = (Map<String, Object>)(om.readValue(responseString, Map.class));
    Map<String, Object> m2 = (Map<String, Object>)(om.readValue(expectedError, Map.class));
    assertEquals(m1,m2);

  }


  @WithMockUser(roles = { "USER","ADMIN" })
  @Test
  public void SellTestWhenExists() throws Exception {
    UserCommons userCommons = UserCommons.builder().id(1L).commonsId(1L).userId(1L).numCows(1).totalWealth(100).cowPrice(10).cowHealth(50).build();
    when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L),eq(1L))).thenReturn(Optional.of(userCommons));
    UserCommons expectedUserCommons = UserCommons.builder().id(1L).commonsId(1L).userId(1L).numCows(0).totalWealth(104).cowPrice(10).cowHealth(50).build();

    MvcResult response = mockMvc
        .perform(post("/api/usercommons/sell?commonsId=1").with(csrf()))
        .andExpect(status().isOk()).andReturn();

    String responseString = response.getResponse().getContentAsString();
    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(eq(1L),eq(1L));
    UserCommons actualUserCommons = objectMapper.readValue(responseString, UserCommons.class);
    assertEquals(expectedUserCommons, actualUserCommons);

  }


  @WithMockUser(roles = { "USER" ,"ADMIN"})
  @Test
  public void SellTestWhenNotExists() throws Exception {

    when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L),eq(1L))).thenReturn(Optional.empty());
    MvcResult response = mockMvc
        .perform(post("/api/usercommons/sell?commonsId=1").with(csrf()))
        .andExpect(status().is(404)).andReturn();

    String responseString = response.getResponse().getContentAsString();
    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(eq(1L),eq(1L));

    ObjectMapper om = new ObjectMapper();
    String expectedError = "{\"type\":\"EntityNotFoundException\",\"message\":\"UserCommons with commonsId 1 and userId 1 not found\"}";
    Map<String, Object> m1 = (Map<String, Object>)(om.readValue(responseString, Map.class));
    Map<String, Object> m2 = (Map<String, Object>)(om.readValue(expectedError, Map.class));
    assertEquals(m1,m2);
  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void get_user_commons_by_id_admin_test() throws Exception {
    UserCommons uc = UserCommons.builder().id(1).commonsId(42).userId(3).build();

    when(userCommonsRepository.findByCommonsIdAndUserId(42L, 3L)).thenReturn(Optional.of(uc));
    MvcResult response = mockMvc.perform(get("/api/usercommons?userId=3&commonsId=42"))
        .andExpect(status().isOk()).andReturn();

    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(42L, 3L);

    String responseString = response.getResponse().getContentAsString();
    UserCommons result = objectMapper.readValue(responseString, UserCommons.class);
    assertEquals(result, uc);
  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void get_user_commons_by_id_admin_nonexistent_test() throws Exception {
    when(userCommonsRepository.findByCommonsIdAndUserId(42L, 3L)).thenReturn(Optional.empty());
    MvcResult response = mockMvc.perform(get("/api/usercommons?userId=3&commonsId=42"))
        .andExpect(status().isNotFound()).andReturn();

    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(42L, 3L);

    Map<String, Object> json = responseToJson(response);
    assertEquals("EntityNotFoundException", json.get("type"));
    assertEquals("UserCommons with commonsId 42 and userId 3 not found", json.get("message"));
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void get_user_commons_by_id_test() throws Exception {
    UserCommons uc = UserCommons.builder().id(1).commonsId(42).userId(1).build();

    when(userCommonsRepository.findByCommonsIdAndUserId(42L, 1L)).thenReturn(Optional.of(uc));
    MvcResult response = mockMvc.perform(get("/api/usercommons/forcurrentuser?commonsId=42"))
        .andExpect(status().isOk()).andReturn();

    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(42L, 1L);

    String responseString = response.getResponse().getContentAsString();
    UserCommons result = objectMapper.readValue(responseString, UserCommons.class);
    assertEquals(result, uc);
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void get_user_commons_by_id_nonexistent_test() throws Exception {

    when(userCommonsRepository.findByCommonsIdAndUserId(42L, 1L)).thenReturn(Optional.empty());
    MvcResult response = mockMvc.perform(get("/api/usercommons/forcurrentuser?commonsId=42"))
        .andExpect(status().isNotFound()).andReturn();

    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(42L, 1L);

    Map<String, Object> json = responseToJson(response);
    assertEquals("EntityNotFoundException", json.get("type"));
    assertEquals("UserCommons with commonsId 42 and userId 1 not found", json.get("message"));
  }
}
