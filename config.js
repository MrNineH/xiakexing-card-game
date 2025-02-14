export const cardDatabase = {
    "拳打": { type: "基础", effect: "damage" },
    "折风剑法": { 
        type: "剑法", 
        cost: 1,
        effect: ["damage", "addBuff"]
    }
};

export const buffs = {
    "神速": { 
        duration: 2, 
        effects: { 
            attackPriority: 1 
        }
    }
};