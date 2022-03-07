package edu.ucsb.cs156.happiercows.controllers;

import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.models.CreateCommonsParams;

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
import static org.mockito.Mockito.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.Map;

import java.time.LocalDateTime;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@WebMvcTest(controllers = CommonsController.class)
public class CommonsControllerTests extends ControllerTestCase {

  @MockBean
  UserCommonsRepository userCommonsRepository;

  @MockBean
  UserRepository userRepository;

  @MockBean
  CommonsRepository commonsRepository;

  @Autowired
  private ObjectMapper objectMapper;

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void createCommonsTest() throws Exception {
    LocalDateTime ldt = LocalDateTime.parse("2018-01-01T08:30:00");

    Commons expectedCommons = Commons.builder()
      .name("Test Commons")
      .cowPrice(100.10)
      .milkPrice(20.20)
      .startingBalance(1000.10)
      .startingDate(ldt)
      .build();

    CreateCommonsParams params = CreateCommonsParams.builder()
      .name("Test Commons")
      .cowPrice(100.10)
      .milkPrice(20.20)
      .startingBalance(1000.10)
      .startingDate(ldt)
      .build();

    String requestBody = objectMapper.writeValueAsString(params);
    String expectedResponse = objectMapper.writeValueAsString(expectedCommons);

    when(commonsRepository.save(expectedCommons))
      .thenReturn(expectedCommons);

    MvcResult response = mockMvc
      .perform(post("/api/commons/new").with(csrf())
      .contentType(MediaType.APPLICATION_JSON)
      .characterEncoding("utf-8")
      .content(requestBody))
      .andExpect(status().isOk())
      .andReturn();

    verify(commonsRepository, times(1)).save(expectedCommons);

    String actualResponse = response.getResponse().getContentAsString();
    assertEquals(expectedResponse, actualResponse);
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void getCommonsTest() throws Exception {
    List<Commons> expectedCommons = new ArrayList<Commons>();
    Commons Commons1 = Commons.builder().name("TestCommons1").build();

    expectedCommons.add(Commons1);
    when(commonsRepository.findAll()).thenReturn(expectedCommons);
    MvcResult response = mockMvc.perform(get("/api/commons/all").contentType("application/json"))
        .andExpect(status().isOk()).andReturn();

    verify(commonsRepository, times(1)).findAll();

    String responseString = response.getResponse().getContentAsString();
    List<Commons> actualCommons = objectMapper.readValue(responseString, new TypeReference<List<Commons>>() {
    });
    assertEquals(actualCommons, expectedCommons);
  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void deleteCommonsThatExistsTest() throws Exception {
    LocalDateTime ldt = LocalDateTime.parse("2018-01-01T08:30:00");
    
    Commons Commons1 = Commons.builder()
      .name("Test Commons")
      .cowPrice(100.10)
      .milkPrice(20.20)
      .startingBalance(1000.10)
      .startingDate(ldt)
      .id(1L)
      .build();

    when(commonsRepository.findById(eq(1L))).thenReturn(Optional.of(Commons1));

    MvcResult response = mockMvc.perform(
            delete("/api/commons/delete?id=1")
                    .with(csrf()))
            .andExpect(status().isOk()).andReturn();

    verify(commonsRepository, times(1)).findById(1L);
        verify(commonsRepository, times(1)).deleteById(1L);
        String responseString = response.getResponse().getContentAsString();
        assertEquals("record 1 deleted", responseString);
  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void deleteCommonsThatDoesNotExistTest() throws Exception {
    when(commonsRepository.findById(eq(1L))).thenReturn(Optional.empty());

    MvcResult response = mockMvc.perform(
      delete("/api/commons/delete?id=1")
        .with(csrf()))
      .andExpect(status().isNotFound()).andReturn();

    verify(commonsRepository, times(1)).findById(1L);
    Map<String, Object> json = responseToJson(response);
    assertEquals("EntityNotFoundException", json.get("type"));
    assertEquals("Commons with id 1 not found", json.get("message"));
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void joinCommonsTest() throws Exception {

    LocalDateTime ldt = LocalDateTime.parse("2018-12-01T08:30:00");

    Commons c = Commons.builder()
      .id(2L)
      .name("Example Commons")
      .cowPrice(100.10)
      .milkPrice(10.20)
      .startingBalance(500.00)
      .startingDate(ldt)
      .build();

    UserCommons uc = UserCommons.builder()
        .userId(1L)
        .commonsId(2L)
        .totalWealth(0)
        .build();

    UserCommons ucSaved = UserCommons.builder()
        .id(17L)
        .userId(1L)
        .commonsId(2L)
        .totalWealth(0)
        .build();

    String requestBody = mapper.writeValueAsString(uc);

    when(userCommonsRepository.findByCommonsIdAndUserId(anyLong(),anyLong())).thenReturn(Optional.empty());
    when(userCommonsRepository.save(eq(uc))).thenReturn(ucSaved);
    when(commonsRepository.findById(eq(2L))).thenReturn(Optional.of(c));

    MvcResult response = mockMvc
        .perform(post("/api/commons/join?commonsId=2").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .characterEncoding("utf-8").content(requestBody))
        .andExpect(status().isOk()).andReturn();

    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(2L, 1L);
    verify(userCommonsRepository, times(1)).save(uc);

    String responseString = response.getResponse().getContentAsString();
    String cAsJson = mapper.writeValueAsString(c);

    assertEquals(responseString, cAsJson);
  }

}
