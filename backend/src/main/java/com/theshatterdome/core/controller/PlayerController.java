package com.theshatterdome.core.controller;

import org.springframework.web.bind.annotation.*;

import com.theshatterdome.core.entity.Character;
import com.theshatterdome.core.entity.Player;
import com.theshatterdome.core.repository.CharacterRepository;
import com.theshatterdome.core.repository.PlayerRepository;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class PlayerController {

    private final PlayerRepository playerRepository;
    private final CharacterRepository characterRepository;

    public PlayerController(PlayerRepository playerRepository, CharacterRepository characterRepository) {
        this.playerRepository = playerRepository;
        this.characterRepository = characterRepository;
    }

    @PostMapping("/update-player-names")
    public List<Player> updatePlayerNames(@RequestBody List<String> playerNames) {
        List<Player> players = playerRepository.findAll()
                .stream()
                .limit(6)
                .collect(Collectors.toList());

        for (int i = 0; i < players.size(); i++) {
            players.get(i).setName(playerNames.get(i));
            playerRepository.save(players.get(i));
        }
        return players;
    }

    @PostMapping("/assign-players")
    public List<Player> assignPlayers(@RequestBody List<String> playerNames) {
        List<Character> characters = characterRepository.findAll();
        Collections.shuffle(characters);

        List<Player> players = playerRepository.findAll()
                .stream()
                .limit(6)
                .collect(Collectors.toList());

        for (int i = 0; i < players.size(); i++) {
            players.get(i).setCharacter(characters.get(i % characters.size()));
            playerRepository.save(players.get(i));
        }
        return players;
    }

    @PutMapping("/players/reset")
    public void resetPlayers() {
        List<Player> players = playerRepository.findAll();
        for (Player player : players) {
            player.setCharacter(null);
            player.setName("");
            playerRepository.save(player);
        }
    }
}