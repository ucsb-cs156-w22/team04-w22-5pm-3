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

import java.util.List;
import java.util.ArrayList;
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
  public void BuyTest() throws Exception {
    UserCommons userCommons = UserCommons.builder().id(1L).commonsId(1L).userId(1L).numCows(1).totalWealth(100).cowPrice(50).cowHealth(100).build();
    userCommonsRepository.save(userCommons);
    UserCommons expectedUserCommons = UserCommons.builder().id(2L).commonsId(2L).userId(1L).numCows(2).totalWealth(50).cowPrice(50).cowHealth(51).build();
    ObjectMapper mapper = new ObjectMapper();
    String requestBody = mapper.writeValueAsString(userCommons);


    when(userCommonsRepository.save(eq(expectedUserCommons))).thenReturn(expectedUserCommons);


    MvcResult response = mockMvc
        .perform(post("/api/usercommons/buy?commonsId=1").with(csrf()))
        .andDo(print())
        .andExpect(status().isOk()).andReturn();

    verify(userCommonsRepository, times(1)).save(userCommons);

    String responseString = response.getResponse().getContentAsString();
    String expectedJson = mapper.writeValueAsString(expectedUserCommons);
    assertEquals(expectedJson, responseString);
  }
}
