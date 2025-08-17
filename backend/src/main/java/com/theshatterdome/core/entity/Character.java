package com.theshatterdome.core.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "`character`")
public class Character {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    @Column(name = "class")
    private String characterClass;
    private int health;
    private int dexterity;
    private int team;

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCharacterClass() { return characterClass; }
    public void setClass(String className) { this.characterClass = className; }

    public int getHealth() { return health; }
    public void setHealth(int health) { this.health = health; }

    public int getDexterity() { return dexterity; }
    public void setDexterity(int dexterity) { this.dexterity = dexterity; }

    public int getTeam() { return team; }
    public void setTeam(int team) { this.team = team; }
}