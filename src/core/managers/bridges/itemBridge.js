
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
            classType: ("classRequirement" in input ? input["classRequirement"].toUpperCase() : undefined),
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
            min: resultItem.identified ? value : getMin(value),
            max: resultItem.identified ? value : getMax(value)
        }
    }

    function getOrElse(key, other) {
        return ((key in input && input[key] != null && input[key] != 0) ? input[key] : other)
    }

    function getMin(raw) {
        return (raw < 0 ? Math.round(raw * 0.7) : Math.round(raw * 0.3))
    }

    function getMax(raw) {
        return Math.round(raw * 1.3)
    }

    function translateStatusName(raw) {
        switch(raw) {
            //translated ones
            case "spellCostPct1": return "1stSpellCost"
            case "spellCostPct2": return "2stSpellCost"
            case "spellCostPct3": return "3stSpellCost"
            case "spellCostPct4": return "4stSpellCost"
            case "spellCostRaw1": return "raw1stSpellCost"
            case "spellCostRaw2": return "raw2stSpellCost"
            case "spellCostRaw3": return "raw3stSpellCost"
            case "spellCostRaw4": return "raw4stSpellCost"
            case "spellDamageRaw": return "rawNeutralSpellDamage"
            case "damageBonusRaw": return "rawMainAttackDamage"
            case "damageBonus": return "mainAttackDamage"
            case "healthRegenRaw": return "rawHealthRegen"
            case "healthBonus": return "health"
            case "attackSpeedBonus": return "rawTierAttackSpeed"
            case "speed": return "walkSpeed"
            case "soulPoints": return "soulPointRegen"
            case "emeraldStealing": return "stealing"
            case "strengthPoints": return "rawStrength"
            case "dexterityPoints": return "rawDexterity"
            case "intelligencePoints": return "rawIntelligence"
            case "defensePoints": return "rawDefense"
            case "agilityPoints": return "rawAgility"
            case "bonusEarthDamage": return "earthDamage"
            case "bonusThunderDamage": return "thunderDamage"
            case "bonusWaterDamage": return "waterDamage"
            case "bonusFireDamage": return "fireDamage"
            case "bonusAirDamage": return "airDamage"
            case "bonusEarthDefense": return "earthDefence"
            case "bonusThunderDefense": return "thunderDefence"
            case "bonusWaterDefense": return "waterDefence"
            case "bonusFireDefense": return "fireDefence"
            case "bonusAirDefense": return "airDefence"
            case "jumpHeight": return "rawJumpHeight"
            case "rainbowSpellDamageRaw": return "rawSpellDamage"
            case "gatherXpBonus": return "gatherXPBonus"
            case "xpBonus": return "XPBonus"

            //same ones
            case "spellDamage": return "spellDamage"
            case "healthRegen": return "healthRegen"
            case "poison": return "poison"
            case "lifeSteal": return "lifeSteal"
            case "manaRegen": return "manaRegen"
            case "exploding": return "exploding"
            case "sprint": return "sprint"
            case "sprintRegen": return "sprintRegen"
            case "lootBonus": return "lootBonus"
            case "lootQuality": return "lootQuality"
            case "gatherSpeed": return "gatherSpeed"

            default: return undefined
        }
    }

    function getStatusType(raw) {
        if(raw.includes("raw")) return "INTEGER"
        else if(raw === "manaRegen" || raw === "lifeSteal") return "FOUR_SECONDS"
        else if(raw === "poison") return "THREE_SECONDS"
        else return "PERCENTAGE"
    }

    return resultItem
}

module.exports.convertWynnItem = convertWynnItem