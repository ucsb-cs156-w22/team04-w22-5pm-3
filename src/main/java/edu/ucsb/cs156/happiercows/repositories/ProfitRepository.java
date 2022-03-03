package edu.ucsb.cs156.happiercows.repositories;

import edu.ucsb.cs156.happiercows.entities.Profit;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface ProfitRepository extends CrudRepository<Profit, Long> {
  Optional<Profit> findById(long id);
  Iterable<Profit> findAllByUserCommonsId(Long user_commons_id);
}
