package edu.ucsb.cs156.happiercows.controllers;

import edu.ucsb.cs156.happiercows.entities.Profit;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.errors.EntityNotFoundException;
import edu.ucsb.cs156.happiercows.models.CurrentUser;
import edu.ucsb.cs156.happiercows.repositories.ProfitRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Optional;

@Api(description = "Profits")
@RequestMapping("/api/profits")
@RestController
@Slf4j
public class ProfitsController extends ApiController {

    @Autowired
    ProfitRepository profitRepository;

    @Autowired
    UserCommonsRepository userCommonsRepository;

    @ApiOperation(value = "List all profits")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/all")
    public Iterable<Profit> allUsersProfits() {
        Iterable<Profit> profits = profitRepository.findAll();
        return profits;
    }

    @ApiOperation(value = "Get a single profit (if it belongs to current user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public Profit getProfitById(
            @ApiParam("id") @RequestParam Long id) {
        Long userId = getCurrentUser().getUser().getId();

        Profit profit = profitRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(Profit.class, id));

        // Ensure that user has access to specified profit
        if (userId != profit.getUserCommons().getUserId())
            throw new EntityNotFoundException(Profit.class, id);

        return profit;
    }

    @ApiOperation(value = "Get all profits belonging to a user commons (if commons belongs to current user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all/commons")
    public Iterable<Profit> allProfitsByUserCommonsId(
            @ApiParam("userCommonsId") @RequestParam Long userCommonsId) {
        Iterable<Profit> profits = profitRepository.findAllByUserCommonsId(userCommonsId);

        return profits;
    }

    @ApiOperation(value = "Get all profits belonging to a user commons (no matter who it belongs to, admin only)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/all/commons")
    public Iterable<Profit> allProfitsByUserCommonsId_admin(
            @ApiParam("userCommonsId") @RequestParam Long userCommonsId) {
        
              // First ensure that user has access to specified user commons
        Long userId = getCurrentUser().getUser().getId();
        UserCommons userCommons = userCommonsRepository.findByCommonsIdAndUserId(userCommonsId, userId)
            .orElseThrow(
                () -> new EntityNotFoundException(UserCommons.class, "userCommonsId", userCommonsId, "userId", userId));

        Iterable<Profit> profits = profitRepository.findAllByUserCommonsId(userCommonsId);
        
        return profits;
    }

    @ApiOperation(value = "Get a single profit (no matter who it belongs to, admin only)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin")
    public Profit getProfitById_admin(
            @ApiParam("id") @RequestParam Long id) {
        Profit profit = profitRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(Profit.class, id));

        return profit;
    }

    @ApiOperation(value = "Create a new Profit")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/post")
    public Profit postProfit(
            @ApiParam("profit") @RequestParam long profit,
            @ApiParam("timestamp") @RequestParam long timestamp,
            @ApiParam("userCommonsId") @RequestParam long userCommonsId) {
        Long userId = getCurrentUser().getUser().getId();

        UserCommons userCommons = userCommonsRepository.findByCommonsIdAndUserId(userCommonsId, userId)
        .orElseThrow(
            () -> new EntityNotFoundException(UserCommons.class, "commonsId", userCommonsId, "userId", userId));

        Profit p = new Profit();
        p.setUserCommons(userCommons);
        p.setProfit(profit);
        p.setTimestamp(timestamp);
        Profit savedProfit = profitRepository.save(p);
        return savedProfit;
    }

    @ApiOperation(value = "Delete a Profit owned by this user")
    @PreAuthorize("hasRole('ROLE_USER')")
    @DeleteMapping("")
    public Object deleteProfit(
            @ApiParam("id") @RequestParam Long id) {
        Long userId = getCurrentUser().getUser().getId();
        
        Profit profit = profitRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(Profit.class, id));

        // Ensure that profit belongs to user before deleting
        if (userId != profit.getUserCommons().getUserId())
            throw new EntityNotFoundException(Profit.class, id);
      
        profitRepository.delete(profit);

        return genericMessage("Profit with id %s deleted".formatted(id));
    }

    @ApiOperation(value = "Delete another user's profit")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/admin")
    public Object deleteProfit_Admin(
            @ApiParam("id") @RequestParam Long id) {
        Profit profit = profitRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(Profit.class, id));

        profitRepository.delete(profit);

        return genericMessage("Profit with id %s deleted".formatted(id));
    }

    @ApiOperation(value = "Update a single profit (if it belongs to current user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PutMapping("")
    public Profit putProfitById(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid Profit incomingProfit) {
        Long userId = getCurrentUser().getUser().getId();

        Profit profit = profitRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(Profit.class, id));

        // Ensure that profit belongs to user before updating
        if (userId != profit.getUserCommons().getUserId())
            throw new EntityNotFoundException(Profit.class, id);

        profit.setProfit(incomingProfit.getProfit());
        profit.setTimestamp(incomingProfit.getTimestamp());

        profitRepository.save(profit);

        return profit;
    }

    @ApiOperation(value = "Update a single profit (regardless of ownership, admin only, can't change ownership)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin")
    public Profit putProfitById_admin(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid Profit incomingProfit) {
        Profit profit = profitRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(Profit.class, id));

        profit.setProfit(incomingProfit.getProfit());
        profit.setTimestamp(incomingProfit.getTimestamp());

        profitRepository.save(profit);

        return profit;
    }
}
