
function convertWynnItem(input) {
    var resultItem = {
        displayName: getOrElse("displayName", input["name"]).replace("֎", ""), // cancer has ֎ in it name for a random reason
        tier: input["tier"].toUpperCase(),
        identified: getOrElse("identified", false),
        powderAmount: input["sockets"],
        attackSpeed: input["attackSpeed"],

        itemInfo: {
            type: getOrElse("type", input["accessoryType"]).toUpperCase(),
            set: input["set"],
            dropType: input["dropType"].toUpperCase(),
            armorColor: (input["armorColor"] != "160,101,64" ? input["armorColor"] : undefined)
        },
        requirements: {
            quest: getOrElse("quest", undefined),
            classType: (("classRequirement" in input && input["classRequirement"] !== null) ? input["classRequirement"].toUpperCase() : undefined),
            level: getOrElse("level", undefined),
            strength: getOrElse("strength", undefined),
            dexterity: getOrElse("dexterity", undefined),
            intelligence: getOrElse("intelligence", undefined),
            defense: getOrElse("defense", undefined),
            agility: getOrElse("agility", undefined)
        },
        damageTypes: {
            neutral: getOrElse("damage", undefined),
            earth: getOrElse("earthDamage", undefined),
            thunder: getOrElse("thunderDamage", undefined),
            water: getOrElse("waterDamage", undefined),
            fire: getOrElse("fireDamage", undefined),
            air: getOrElse("airDamage", undefined)
        },
        defenseTypes: {
            health: getOrElse("health", undefined),
            earth: getOrElse("earthDefense", undefined),
            thunder: getOrElse("thunderDefense", undefined),
            water: getOrElse("waterDefense", undefined),
            fire: getOrElse("fireDefense", undefined),
            air: getOrElse("airDefense", undefined)
        },
        statuses: {},
        majorIds: getOrElse("majorIds", []),
        restriction: input["restrictions"],

        lore: getOrElse("addedLore", "")
    }

    for(key in input) {
        var value = input[key]

        //material info
        if(key === "armorType") {
            resultItem.itemInfo["material"] = ("minecraft:" + value.toLowerCase() + "_" + resultItem.itemInfo["type"].toLowerCase()).replace("chain", "chainmail")
            continue
        }
        if(key === "material" && value !== null) {
            resultItem.itemInfo["material"] = value
            continue
        }

        if(typeof value != 'number' || value == 0) continue

        var translatedName = translateStatusName(key)
        if(typeof translatedName == "undefined") continue

        resultItem.statuses[translatedName] = {
            type: getStatusType(translatedName),
            isFixed: isFixed(translatedName),
            baseValue: value
        }
    }

    function getOrElse(key, other) {
        return ((key in input && input[key] != null && input[key] != 0 && input[key] != "0-0") ? input[key] : other)
    }

    function isFixed(raw) {
        if(resultItem.identified) return true;

        switch(raw) {
            case "rawStrength": return true;
            case "rawDexterity": return true;
            case "rawIntelligence": return true;
            case "rawDefence": return true;
            case "rawAgility": return true;

            default: return false;
        }
    }

    function translateStatusName(raw) {
        switch(raw) {
            //translated ones
            case "spellCostPct1": return "1stSpellCost" //
            case "spellCostPct2": return "2ndSpellCost" //
            case "spellCostPct3": return "3rdSpellCost" //
            case "spellCostPct4": return "4thSpellCost" //
            case "spellCostRaw1": return "raw1stSpellCost" //
            case "spellCostRaw2": return "raw2ndSpellCost" //
            case "spellCostRaw3": return "raw3rdSpellCost" //
            case "spellCostRaw4": return "raw4thSpellCost" //
            case "spellDamageRaw": return "rawNeutralSpellDamage" //
            case "damageBonusRaw": return "rawMainAttackNeutralDamage" //
            case "damageBonus": return "mainAttackDamage" //
            case "healthRegenRaw": return "rawHealthRegen" //
            case "healthBonus": return "rawHealth" //
            case "speed": return "walkSpeed" //
            case "soulPoints": return "soulPointRegen" //
            case "emeraldStealing": return "stealing" //
            case "strengthPoints": return "rawStrength" //
            case "dexterityPoints": return "rawDexterity" //
            case "intelligencePoints": return "rawIntelligence" //
            case "defensePoints": return "rawDefence" //
            case "agilityPoints": return "rawAgility" //
            case "bonusEarthDamage": return "earthDamage" //
            case "bonusThunderDamage": return "thunderDamage" //
            case "bonusWaterDamage": return "waterDamage" //
            case "bonusFireDamage": return "fireDamage" //
            case "bonusAirDamage": return "airDamage" //
            case "bonusEarthDefense": return "earthDefence" //
            case "bonusThunderDefense": return "thunderDefence" //
            case "bonusWaterDefense": return "waterDefence" //
            case "bonusFireDefense": return "fireDefence" //
            case "bonusAirDefense": return "airDefence" //
            case "jumpHeight": return "rawJumpHeight" //
            case "rainbowSpellDamageRaw": return "rawSpellDamage" //
            case "gatherXpBonus": return "gatherXPBonus" //
            case "attackSpeedBonus": return "attackSpeed" //

            //same ones
            case "spellDamage": return "spellDamage" //
            case "healthRegen": return "healthRegen" //
            case "poison": return "poison" //
            case "lifeSteal": return "lifeSteal" //
            case "manaRegen": return "manaRegen" //
            case "exploding": return "exploding" //
            case "sprint": return "sprint" //
            case "sprintRegen": return "sprintRegen" //
            case "lootBonus": return "lootBonus" //
            case "lootQuality": return "lootQuality" //
            case "gatherSpeed": return "gatherSpeed" //
            case "xpBonus": return "xpBonus" //
            case "manaSteal": return "manaSteal" //
            case "thorns": return "thorns" //
            case "reflection": return "reflection" //

            default: return undefined
        }
    }

    function getStatusType(raw) {
        if(raw.includes("raw")) return "INTEGER"
        else if(raw === "manaRegen" || raw === "lifeSteal" || raw === "manaSteal") return "FOUR_SECONDS"
        else if(raw === "poison") return "THREE_SECONDS"
        else if(raw === "attackSpeed") return "TIER"
        else return "PERCENTAGE"
    }

    return resultItem
}

function getIdOrder() {
    return {
        order: {
            //first group {SP stuff}
            "rawStrength": 1,
            "rawDexterity": 2,
            "rawIntelligence": 3,
            "rawDefence": 4,
            "rawAgility": 5,
            //second group {attack stuff}
            "attackSpeed": 6,
            "rawMainAttackNeutralDamage": 7,
            "mainAttackDamage": 8,
            "rawNeutralSpellDamage": 9,
            "rawSpellDamage": 10,
            "spellDamage": 11,
            //third group {health/mana stuff}
            "rawHealth": 12,
            "rawHealthRegen": 13,
            "healthRegen": 14,
            "lifeSteal": 15,
            "manaRegen": 16,
            "manaSteal": 17,
            //fourth group {damage stuff}
            "earthDamage": 18,
            "thunderDamage": 19,
            "waterDamage": 20,
            "fireDamage": 21,
            "airDamage": 22,
            //fifth group {defence stuff}
            "earthDefence": 23,
            "thunderDefence": 24,
            "waterDefence": 25,
            "fireDefence": 26,
            "airDefence": 27,
            //sixth group {passive damage}
            "exploding": 28,
            "poison": 29,
            "thorns": 30,
            "reflection": 31,
            //seventh group {movement stuff}
            "walkSpeed": 32,
            "sprint": 32,
            "sprintRegen": 34,
            "rawJumpHeight": 35,
            //eigth group {XP/Gathering stuff}
            "soulPointRegen": 36,
            "lootBonus": 37,
            "lootQuality": 38,
            "emeraldStealing": 39,
            "xpBonus": 40,
            "gatherXPBonus": 41,
            "gatherSpeed": 42,
            //ninth group {spell stuff}
            "raw1stSpellCost": 43,
            "1stSpellCost": 44,
            "raw2ndSpellCost": 45,
            "2ndSpellCost": 46,
            "raw3rdSpellCost": 47,
            "3rdSpellCost": 48,
            "raw4thSpellCost": 49,
            "4thSpellCost": 50
        },
        groups: [
            "1-5",
            "6-11",
            "12-17",
            "18-22",
            "23-27",
            "28-31",
            "32-35",
            "36-42",
            "43-50"
        ],
        inverted: [
            "1stSpellCost",
            "2ndSpellCost",
            "3rdSpellCost",
            "4thSpellCost",
            "raw1stSpellCost",
            "raw2ndSpellCost",
            "raw3rdSpellCost",
            "raw4thSpellCost",
        ]
    }
}

module.exports.convertWynnItem = convertWynnItem
module.exports.getIdOrder = getIdOrder
