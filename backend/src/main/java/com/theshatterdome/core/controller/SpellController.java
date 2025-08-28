package com.theshatterdome.core.controller;

import com.theshatterdome.core.entity.Spell;
import com.theshatterdome.core.repository.SpellRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class SpellController {
    private final SpellRepository spellRepository;

    public SpellController(SpellRepository spellRepository) {
        this.spellRepository = spellRepository;
    }

    @GetMapping("/spells/{characterId}")
    public List<Spell> getSpellsByCharacter(@PathVariable int characterId) {
        return spellRepository.findByCharacter_Id(characterId);
    }
}