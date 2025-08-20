package com.theshatterdome.core.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.theshatterdome.core.entity.Character;
import com.theshatterdome.core.repository.CharacterRepository;

import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;


@RestController
@RequestMapping("/api")
public class CharacterController {

    private final CharacterRepository characterRepository;

    public CharacterController(CharacterRepository characterRepository) {
        this.characterRepository = characterRepository;
    }

    @GetMapping("/characters")
    public List<Character> getAllCharacters() {
        return characterRepository.findAll();
    }

    @PutMapping("/character/{id}/health")
    public Character updateHealth(@PathVariable int id, @RequestBody int health) {
        Character character = characterRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Character not found"));
        character.setHealth(health);
        return characterRepository.save(character);
    }
}