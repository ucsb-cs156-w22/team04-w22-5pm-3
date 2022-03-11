package edu.ucsb.cs156.happiercows.controllers;

import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.http.MediaType;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import org.springframework.beans.factory.annotation.Autowired;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.mockito.Mockito.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.*;
import java.util.Optional;


import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;


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

  @WithMockUser(roles = { "USER" })
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

  @WithMockUser(roles = { "USER" })
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


  @WithMockUser(roles = { "USER" })
  @Test
  public void SellTestWhenExists() throws Exception {
    UserCommons userCommons = UserCommons.builder().id(1L).commonsId(1L).userId(1L).numCows(1).totalWealth(100).cowPrice(10).cowHealth(50).build();
    when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L),eq(1L))).thenReturn(Optional.of(userCommons));
    UserCommons expectedUserCommons = UserCommons.builder().id(1L).commonsId(1L).userId(1L).numCows(0).totalWealth(104).cowPrice(10).cowHealth(50).build();

    MvcResult response = mockMvc
        .perform(put("/api/usercommons/sell?commonsId=1").with(csrf()))
        .andExpect(status().isOk()).andReturn();

    String responseString = response.getResponse().getContentAsString();
    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(eq(1L),eq(1L));
    UserCommons actualUserCommons = objectMapper.readValue(responseString, UserCommons.class);
    assertEquals(expectedUserCommons, actualUserCommons);
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void SellTestWhenNotExists() throws Exception {

    when(userCommonsRepository.findByCommonsIdAndUserId(eq(1L),eq(1L))).thenReturn(Optional.empty());
    MvcResult response = mockMvc
        .perform(put("/api/usercommons/sell?commonsId=1").with(csrf()))
        .andExpect(status().is(404)).andReturn();

    String responseString = response.getResponse().getContentAsString();
    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(eq(1L),eq(1L));

    ObjectMapper om = new ObjectMapper();
    String expectedError = "{\"type\":\"EntityNotFoundException\",\"message\":\"UserCommons with commonsId 1 and userId 1 not found\"}";
    Map<String, Object> m1 = (Map<String, Object>)(om.readValue(responseString, Map.class));
    Map<String, Object> m2 = (Map<String, Object>)(om.readValue(expectedError, Map.class));
    assertEquals(m1,m2);
    
    
  }
}
