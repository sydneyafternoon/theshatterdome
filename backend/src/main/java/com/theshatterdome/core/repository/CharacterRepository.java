package com.theshatterdome.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.theshatterdome.core.entity.Character;

public interface CharacterRepository extends JpaRepository<Character, Integer> {}