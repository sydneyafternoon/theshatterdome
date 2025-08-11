package com.theshatterdome.core;

import org.springframework.web.bind.annotation.*;
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
}