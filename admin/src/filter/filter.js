/**
 * filter value by key: {{SECTION_CHARGE | optionKV(section.charge)}}
 * @param list {CHARGE:{key:"C", value:"chargeable"}, FREE:{key:"F", value:"free"}}
 * @param key "C"
 */
let optionKV = (object, key) => {
    if (!object || !key) {
        return "";
    } else {
        let result = "";
        for (let enums in object) {
            if (key === object[enums]["key"]) {
                result = object[enums]["value"];
            }
        }
        return result
    }
};

/**
 * filter value by key: {{CHARGE | optionKV(section.charge)}}
 * @param list [{key:"C", value:"chargeable"},{key:"F", value:"free"}]
 * @param key "C"
 */
let optionKVArray = (list, key) => {
    if (!list || !key) {
        return "";
    } else {
        let result = "";
        for (let i = 0; i < list.length; i++) {
            if (key === list[i]["key"]) {
                result = list[i]["value"];
            }
        }
        return result
    }
};

export default {
    optionKV,
    optionKVArray
}