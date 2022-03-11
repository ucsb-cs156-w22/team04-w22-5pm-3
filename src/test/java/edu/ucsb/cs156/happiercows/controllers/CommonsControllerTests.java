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
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Map;
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


  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void admin_can_edit_an_existing_common() throws Exception {

    Commons commonsOrig = Commons.builder()
      .name("Commons 1")
      .cowPrice(13579.1)
      .milkPrice(2468.1)
      .startingBalance(12345.1)
      .build();

    Commons commonsEdited = Commons.builder()
      .name("Commons 2")
      .cowPrice(97531.2)
      .milkPrice(9642.2)
      .startingBalance(54321.2)
      .build();

    String requestBody = mapper.writeValueAsString(commonsEdited);

    when(commonsRepository.findById(eq(67L))).thenReturn(Optional.of(commonsOrig));

    // act
    MvcResult response = mockMvc.perform(
      put("/api/commons?id=67")
        .contentType(MediaType.APPLICATION_JSON)
        .characterEncoding("utf-8")
        .content(requestBody)
        .with(csrf()))
      .andExpect(status().isOk()).andReturn();

      // assert
      verify(commonsRepository, times(1)).findById(67L);
      verify(commonsRepository, times(1)).save(commonsEdited); // should be saved with correct user
      String responseString = response.getResponse().getContentAsString();
      assertEquals(requestBody, responseString);
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void join_commons_nonexistent_test() throws Exception {
    UserCommons uc = UserCommons.builder().userId(1L).commonsId(2L).totalWealth(0).build();

    String requestBody = mapper.writeValueAsString(uc);

    when(userCommonsRepository.findByCommonsIdAndUserId(2L, 1L)).thenReturn(Optional.empty());
    when(commonsRepository.findById(eq(2L))).thenReturn(Optional.empty());

    MvcResult response = mockMvc
        .perform(post("/api/commons/join?commonsId=2").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .characterEncoding("utf-8").content(requestBody))
        .andExpect(status().isNotFound()).andReturn();

    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(2L, 1L);
    verify(userCommonsRepository, times(1)).save(uc);
    verify(commonsRepository, times(1)).findById(2L);

    Map<String, Object> json = responseToJson(response);
    assertEquals("EntityNotFoundException", json.get("type"));
    assertEquals("Commons with id 2 not found", json.get("message"));
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void join_commons_already_joined_test() throws Exception {

    Commons c = Commons.builder().id(2L).name("Example Commons").build();
    UserCommons uc = UserCommons.builder().userId(1L).commonsId(2L).totalWealth(0).build();

    String requestBody = mapper.writeValueAsString(uc);

    when(userCommonsRepository.findByCommonsIdAndUserId(2L, 1L)).thenReturn(Optional.of(uc));
    when(commonsRepository.findById(2L)).thenReturn(Optional.of(c));

    MvcResult response = mockMvc
        .perform(post("/api/commons/join?commonsId=2").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .characterEncoding("utf-8").content(requestBody))
        .andExpect(status().isOk()).andReturn();

    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(2L, 1L);
    verify(userCommonsRepository, times(0)).save(uc);

    String responseString = response.getResponse().getContentAsString();
    String cAsJson = mapper.writeValueAsString(c);

    assertEquals(responseString, cAsJson);
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void join_commons_already_joined_nonexistent_test() throws Exception {

    Commons c = Commons.builder().id(2L).name("Example Commons").build();
    UserCommons uc = UserCommons.builder().userId(1L).commonsId(2L).totalWealth(0).build();

    String requestBody = mapper.writeValueAsString(uc);

    when(userCommonsRepository.findByCommonsIdAndUserId(2L, 1L)).thenReturn(Optional.of(uc));
    when(commonsRepository.findById(2L)).thenReturn(Optional.empty());

    MvcResult response = mockMvc
        .perform(post("/api/commons/join?commonsId=2").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .characterEncoding("utf-8").content(requestBody))
        .andExpect(status().isNotFound()).andReturn();

    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(2L, 1L);
    verify(userCommonsRepository, times(0)).save(uc);

    Map<String, Object> json = responseToJson(response);
    assertEquals("EntityNotFoundException", json.get("type"));
    assertEquals("Commons with id 2 not found", json.get("message"));
  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void delete_user_from_commons_test() throws Exception {
    UserCommons uc = UserCommons.builder().id(1).commonsId(42).userId(3).build();

    when(userCommonsRepository.findByCommonsIdAndUserId(42L, 3L)).thenReturn(Optional.of(uc));

    MvcResult response = mockMvc
        .perform(delete("/api/commons/42/users/3").with(csrf()))
        .andExpect(status().isNoContent()).andReturn();

    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(42L, 3L);
    verify(userCommonsRepository, times(1)).deleteById(1L);

  }

  @WithMockUser(roles = { "ADMIN" })
  @Test

  public void admin_cannot_edit_common_that_does_not_exist() throws Exception {
    // arrange

    Commons commonsEdited = Commons.builder()
      .name("Commons 2")
      .cowPrice(97531.2)
      .milkPrice(9642.2)
      .startingBalance(54321.2)
      .build();

    String requestBody = mapper.writeValueAsString(commonsEdited);

    when(commonsRepository.findById(eq(67L))).thenReturn(Optional.empty());

    // act
    MvcResult response = mockMvc.perform(
      put("/api/commons?id=67")
        .contentType(MediaType.APPLICATION_JSON)
        .characterEncoding("utf-8")
        .content(requestBody)
        .with(csrf()))
      .andExpect(status().isNotFound()).andReturn();

    // assert

    verify(commonsRepository, times(1)).findById(67L);
    Map<String, Object> json = responseToJson(response);
    assertEquals("EntityNotFoundException", json.get("type"));
    assertEquals("Commons with id 67 not found", json.get("message"));
  }

  public void delete_user_from_commons_nonexistent_test() throws Exception {
    when(userCommonsRepository.findByCommonsIdAndUserId(42L, 3L)).thenReturn(Optional.empty());
    
    MvcResult response = mockMvc
        .perform(delete("/api/commons/42/users/3").with(csrf()))
        .andDo(print())
        .andExpect(status().isNotFound()).andReturn();

    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(42L, 3L);

    Map<String, Object> json = responseToJson(response);
    assertEquals("EntityNotFoundException", json.get("type"));
    assertEquals("UserCommons with commonsId 42 and userId 3 not found", json.get("message"));
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void get_commons_by_id_test() throws Exception {
    Commons c = Commons.builder().id(2L).name("Example Commons").build();

    when(commonsRepository.findById(2L)).thenReturn(Optional.of(c));

    MvcResult response = mockMvc
        .perform(get("/api/commons?id=2"))
        .andExpect(status().isOk()).andReturn();

    verify(commonsRepository, times(1)).findById(2L);
    
    String responseString = response.getResponse().getContentAsString();
    String cAsJson = mapper.writeValueAsString(c);

    assertEquals(responseString, cAsJson);
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void get_commons_by_id_nonexistent_test() throws Exception {
    when(commonsRepository.findById(2L)).thenReturn(Optional.empty());

    MvcResult response = mockMvc
        .perform(get("/api/commons?id=2"))
        .andExpect(status().isNotFound()).andReturn();

    verify(commonsRepository, times(1)).findById(2L);
    
    Map<String, Object> json = responseToJson(response);
    assertEquals("EntityNotFoundException", json.get("type"));
    assertEquals("Commons with id 2 not found", json.get("message"));
  }

  // additional tests
 
 // get all
 @Test
 public void api_commons_all__logged_out__returns_403() throws Exception {
   mockMvc.perform(get("/api/commons/all"))
       .andExpect(status().is(403));
 }
 
 @WithMockUser(roles = { "USER" , "ADMIN"})
 @Test
 public void api_commons_all__logged_in__returns_ok() throws Exception {
   mockMvc.perform(get("/api/commons/all"))
     .andExpect(status().isOk());
 }
 
 // get
 @Test
 public void api_commons_get__logged_out__returns_403() throws Exception {
   mockMvc.perform(get("/api/commons?id=1"))
       .andExpect(status().is(403));
 }
 
 
 // join commons
 @Test
 public void api_commons_join__logged_out__returns_403() throws Exception {
   mockMvc.perform(post("/api/commons/join"))
     .andExpect(status().is(403));
 }
 
 // Authorization tests for /api/commons/post
 
 @Test
 public void api_commons_post__logged_out__returns_403() throws Exception {
   mockMvc.perform(post("/api/commons/new"))
     .andExpect(status().is(403));
 }
 
 @WithMockUser(roles = { "USER" })
 @Test
 public void api_commons_post__user_logged_in__returns_403() throws Exception {
   mockMvc.perform(post("/api/commons/new"))
     .andExpect(status().is(403));
 }
 
 // Authorization tests for /api/commons/put
 @Test
 public void api_commons_put__logged_out__returns_403() throws Exception {
   mockMvc.perform(post("/api/commons?id=1"))
     .andExpect(status().is(403));
 }
 
 @WithMockUser(roles = { "USER" })
 @Test
 public void api_commons_put__user_logged_in__returns_403() throws Exception {
   mockMvc.perform(post("/api/commons?id=1"))
     .andExpect(status().is(403));
 }
 
 
 // Authorization tests for /api/commons/{commonsId}/users/{userId}
 // delete user
 @Test
 public void api_commons_delete_user__logged_out__returns_403() throws Exception {
   mockMvc.perform(post("/api/commons/1/users/1"))
     .andExpect(status().is(403));
 }
 
 @WithMockUser(roles = { "USER" })
 @Test
 public void api_commons_delete_user__user_logged_in__returns_403() throws Exception {
   mockMvc.perform(post("/api/commons/1/users/1"))
     .andExpect(status().is(403));
 }
 
 // Authorization tests for /api/commons/delete
  @Test
 public void api_commons_delete__logged_out__returns_403() throws Exception {
   mockMvc.perform(post("/api/commons/delete"))
     .andExpect(status().is(403));
 }
 
 @WithMockUser(roles = { "USER" })
 @Test
 public void api_commons_delete__user_logged_in__returns_403() throws Exception {
   mockMvc.perform(post("/api/commons/delete"))
     .andExpect(status().is(403));
 }



}
