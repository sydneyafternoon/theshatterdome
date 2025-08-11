package com.theshatterdome.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.theshatterdome.core.entity.Player;

public interface PlayerRepository extends JpaRepository<Player, Integer> {}