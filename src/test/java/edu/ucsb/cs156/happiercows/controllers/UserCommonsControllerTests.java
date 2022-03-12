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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
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

    @WithMockUser(roles = {"ADMIN"})
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

    @WithMockUser(roles = {"ADMIN"})
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

    @WithMockUser(roles = {"USER"})
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

    @WithMockUser(roles = {"USER"})
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

    @WithMockUser(roles = {"USER"})
    @Test
    public void BuyTest() throws Exception {
        UserCommons userCommons = UserCommons.builder().id(1L).commonsId(1L).userId(1L).numCows(1).totalWealth(100).cowPrice(50).cowHealth(100).build();
        UserCommons expectedUserCommons = UserCommons.builder().id(1L).commonsId(1L).userId(1L).numCows(2).totalWealth(50).cowPrice(50).cowHealth(50.5).build();
        ObjectMapper mapper = new ObjectMapper();


        when(userCommonsRepository.findByCommonsIdAndUserId(1L, 1L)).thenReturn(Optional.of(userCommons));

        MvcResult response = mockMvc
                .perform(post("/api/usercommons/buy?commonsId=1").with(csrf()))
                .andDo(print())
                .andExpect(status().isOk()).andReturn();

        verify(userCommonsRepository, times(1)).save(userCommons);

        String responseString = response.getResponse().getContentAsString();
        String expectedJson = mapper.writeValueAsString(expectedUserCommons);
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void SellTest() throws Exception {
        UserCommons userCommons = UserCommons.builder().id(1L).commonsId(1L).userId(1L).numCows(1).totalWealth(100).cowPrice(50).cowHealth(100).build();
        UserCommons expectedUserCommons = UserCommons.builder().id(1L).commonsId(1L).userId(1L).numCows(0).totalWealth(140).cowPrice(50).cowHealth(100).build();
        ObjectMapper mapper = new ObjectMapper();


        when(userCommonsRepository.findByCommonsIdAndUserId(1L, 1L)).thenReturn(Optional.of(userCommons));

        MvcResult response = mockMvc
                .perform(post("/api/usercommons/sell?commonsId=1").with(csrf()))
                .andDo(print())
                .andExpect(status().isOk()).andReturn();

        verify(userCommonsRepository, times(1)).save(userCommons);

        String responseString = response.getResponse().getContentAsString();
        String expectedJson = mapper.writeValueAsString(expectedUserCommons);
        assertEquals(expectedJson, responseString);
    }
}