
function convertWynnItem(input) {
    var resultItem = {
        displayName: getOrElse("displayName", input["name"]),
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

        var min = getMin(value)
        var max = getMax(value)

        if(min > max) {
            min = max
            max = getMin(value)
        }

        resultItem.statuses[translatedName] = {
            type: getStatusType(translatedName),
            min: isFixed(translatedName) ? value : min,
            max: isFixed(translatedName) ? value : max
        }
    }

    function getOrElse(key, other) {
        return ((key in input && input[key] != null && input[key] != 0 && input[key] != "0-0") ? input[key] : other)
    }

    function getMin(raw) {
        var result = (raw < 0 ? Math.round(raw * 0.7) : Math.round(raw * 0.3))
        return result != 0 ? result : (raw < 0 ? -1 : 1)
    }

    function getMax(raw) {
        return Math.round(raw * 1.3)
    }

    function isFixed(raw) {
        if(resultItem.identified) return true;

        switch(raw) {
            case "rawStrength": return true;
            case "rawDexterity": return true;
            case "rawIntelligence": return true;
            case "rawDefense": return true;
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
            case "defensePoints": return "rawDefense" //
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
            //first group {attack stuff}
            "attackSpeed": 1,
            "mainAttackDamage": 2,
            "rawMainAttackNeutralDamage": 3,
            "rawNeutralSpellDamage": 4,
            "rawSpellDamage": 5,
            "spellDamage": 6,
            //second group {health/mana stuff}
            "rawHealth": 7,
            "rawHealthRegen": 8,
            "healthRegen": 9,
            "lifeSteal": 10,
            "manaRegen": 11,
            "manaSteal": 12,
            //third group {damage stuff}
            "earthDamage": 13,
            "thunderDamage": 14,
            "waterDamage": 15,
            "fireDamage": 16,
            "airDamage": 17,
            //fourth group {defence stuff}
            "earthDefence": 18,
            "thunderDefence": 19,
            "waterDefence": 20,
            "fireDefence": 21,
            "airDefence": 22,
            //fifth group {SP stuff}
            "rawStrength": 23,
            "rawDexterity": 24,
            "rawIntelligence": 25,
            "rawDefense": 26,
            "rawAgility": 27,
            //sixth group {XP/Gathering stuff}
            "xpBonus": 28,
            "gatherXPBonus": 29,
            "lootBonus": 30,
            "lootQuality": 31,
            "gatherSpeed": 32,
            "emeraldStealing": 33,
            "soulPointRegen": 34,
            //seventh group {movement stuff}
            "walkSpeed": 35,
            "sprint": 36,
            "sprintRegen": 37,
            "rawJumpHeight": 38,
            //eighth group {passive damage}
            "poison": 39,
            "exploding": 40,
            "thorns": 41,
            "reflection": 42,
            //ninth group {spell stuff}
            "1stSpellCost": 43,
            "raw1stSpellCost": 44,
            "2ndSpellCost": 45,
            "raw2ndSpellCost": 46,
            "3rdSpellCost": 47,
            "raw3rdSpellCost": 48,
            "4thSpellCost": 49,
            "raw4thSpellCost": 50
        },
        groups: [
            "1-6",
            "7-12",
            "13-17",
            "18-22",
            "23-27",
            "28-34",
            "35-39",
            "39-42",
            "43-50"
        ]
    }
}

module.exports.convertWynnItem = convertWynnItem
module.exports.getIdOrder = getIdOrder