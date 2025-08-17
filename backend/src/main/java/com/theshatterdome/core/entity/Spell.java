package com.theshatterdome.core.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "spell")
public class Spell {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private int mana_cost;
    private String effect;

    @ManyToOne
    @JoinColumn(name = "element_id")
    private Element element;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private SpellType type;

    @ManyToOne
    @JoinColumn(name = "sorcerer_id")
    private Character character;

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Element getElement() { return element; }
    public void setElement(Element element) { this.element = element; }

    public int getMana_cost() { return mana_cost; }
    public void setMana_cost(int mana_cost) { this.mana_cost = mana_cost; }

    public String getEffect() { return effect; }
    public void setEffect(String effect) { this.effect = effect; }

    public SpellType getType() { return type; }
    public void setType(SpellType type) { this.type = type; }

    public Character getSorcerer() { return character; }
    public void setSorcerer(Character character) { this.character = character; }
}