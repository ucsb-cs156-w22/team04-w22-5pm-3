package edu.ucsb.cs156.happiercows.models;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.AccessLevel;

import java.time.LocalDateTime;

import org.springframework.security.core.GrantedAuthority;

import edu.ucsb.cs156.happiercows.entities.User;

import java.util.Collection;

import org.springframework.format.annotation.NumberFormat;
import org.springframework.format.annotation.DateTimeFormat;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class CreateCommonsParams {
  private String name;
  //@NumberFormat private double cowPrice;
  //@NumberFormat private double milkPrice;
  //@NumberFormat private double startingBalance;
  @DateTimeFormat private LocalDateTime startingDate;
}
