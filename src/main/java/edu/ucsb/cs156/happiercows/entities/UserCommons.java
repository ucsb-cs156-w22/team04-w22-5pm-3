package edu.ucsb.cs156.happiercows.entities;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Builder;
import lombok.AccessLevel;


import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity(name = "user_commons")
public class UserCommons {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;  

  @Column(name="commons_id")
  private long commonsId;  

  @Column(name="user_id")
  private long userId;  

  @Column(name="num_cows")
  private int numCows;

  @Column(name="total_wealth")
  private double totalWealth;

  @Column(name="cow_price")
  private double cowPrice;

  @Column(name="cow_health")
  private double cowHealth;

  public double getCowSellingPrice() {
    return ( this.getCowPrice() * 0.8 * (this.getCowHealth()/100) );
  }
}

