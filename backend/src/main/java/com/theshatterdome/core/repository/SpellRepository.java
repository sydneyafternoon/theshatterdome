package com.theshatterdome.core.repository;

import com.theshatterdome.core.entity.Spell;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SpellRepository extends JpaRepository<Spell, Integer> {
    List<Spell> findByCharacter_Id(int characterId);
}