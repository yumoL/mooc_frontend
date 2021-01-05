/**
 * filter value by key: {{CHARGE | optionKV(section.charge)}}
 * @param list [{key:"C", value:"chargeable"},{key:"F", value:"free"}]
 * @param key "C"
 */
let optionKV = (list, key) => {
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
    optionKV
}