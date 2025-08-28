package com.theshatterdome.core.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class ChannelingController {
    @PostMapping("/generate-japanese-question")
    public String generateJapaneseQuestion(@RequestBody String prompt) {
        try (Client client = new Client()) {
            GenerateContentResponse response =
                client.models.generateContent(
                    "gemini-2.5-flash",
                    prompt,
                    null);

            // System.out.println(response.text());
            return response.text();
        }
    }
}