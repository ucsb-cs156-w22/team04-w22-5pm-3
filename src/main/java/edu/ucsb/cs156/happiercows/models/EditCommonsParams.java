package edu.ucsb.cs156.happiercows.models;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.AccessLevel;
import java.time.LocalDateTime;
import org.springframework.security.core.GrantedAuthority;
import edu.ucsb.cs156.happiercows.entities.User;
import org.springframework.format.annotation.NumberFormat;
import org.springframework.format.annotation.DateTimeFormat;
import java.util.Collection;
@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class EditCommonsParams {
  private String name;
  @NumberFormat private double cowPrice;
  @NumberFormat private double milkPrice;
  @NumberFormat private double startingBalance;
}








