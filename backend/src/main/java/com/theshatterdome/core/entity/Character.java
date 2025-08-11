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
    private int level;
    private int health;
    private int dexterity;
    private int strength;
    private int wisdom;
    private int wickedness;
    private int acuity;
    private int faith;

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCharacterClass() { return characterClass; }
    public void setClass(String className) { this.characterClass = className; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public int getHealth() { return health; }
    public void setHealth(int health) { this.health = health; }

    public int getDexterity() { return dexterity; }
    public void setDexterity(int dexterity) { this.dexterity = dexterity; }

    public int getStrength() { return strength; }
    public void setStrength(int strength) { this.strength = strength; }

    public int getWisdom() { return wisdom; }
    public void setWisdom(int wisdom) { this.wisdom = wisdom; }

    public int getWickedness() { return wickedness; }
    public void setWickedness(int wickedness) { this.wickedness = wickedness; }

    public int getAcuity() { return acuity; }
    public void setAcuity(int acuity) { this.acuity = acuity; }

    public int getFaith() { return faith; }
    public void setFaith(int faith) { this.faith = faith; }
}