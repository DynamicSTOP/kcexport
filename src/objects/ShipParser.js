import WCTFships from './../generated/ships';

/**
 *
 * Groups -> array of ships split by type
 * Raw -> that long long share link
 * Array -> encoded array of ships.
 * Ships -> array of ships elements
 *
 */

class ShipParser {
    constructor() {
        this.stype = ["", "DE", "DD", "CL", "CLT",
            "CA", "CAV", "CVL", "FBB", "BB", "BBV",
            "CV", "XBB", "SS", "SSV", "AP", "AV",
            "LHA", "CVB", "AR", "AS", "CT", "AO"
        ];
    }

    arrayFromShips(shipObjects) {
        return shipObjects.map((s) => [
            s.id, //0
            s.masterId, //1
            s.lvl, //2
            s.sally ? s.sally : 0,//3
            s.extra_slot ? 1 : 0, //4
            s.as, //5
            s.aa, //6
            s.tp, //7
            s.ar, //8
            s.fp, //9
            s.lk, //10
            s.hp  //11
        ]);
    }

    groupsFromRawArray(ships = []) {
        let tempShipsData = this.stype.map((t) => Object.assign({}, {name: t, ships: []}));
        ships.map((s) => {
                const master = WCTFships[s[1]];
                if (typeof master === "undefined") {
                    tempShipsData[0].ships.push({
                        id: s[0],
                        masterId: s[1],
                        new: true,
                        lvl: s[2],
                        sally: s[3],
                        extraSlot: s[4] === 1,
                        aa: s[6],
                        aa_max: s[6],
                        tp: s[7],
                        tp_max: s[7],
                        ar: s[8],
                        ar_max: s[8],
                        fp: s[9],
                        fp_max: s[9],
                        lk: s[10],
                        lk_max: s[10],
                        hp: s[11],
                        hp_def: s[11],
                        hp_max: s[11],
                        as: s[5],
                        as_def: s[5],
                        as_max: s[5],
                        los: 0,
                        los_def: 0,
                        los_max: 0,
                        evasion: 0,
                        evasion_def: 0,
                        evasion_max: 0,
                        name: "New Face",
                        nameJp: "",
                        fast: false,
                        range: 1,
                        suffix: "",
                        stype: 0,
                        slots: [],
                        daihatsu: false,
                        sortno: 9999
                    });
                    return true;
                }
                const type = this.stype.indexOf(WCTFships[s[1]].api_typen);

                tempShipsData[type].ships.push({
                    // WCTF: master,
                    id: s[0],
                    masterId: s[1],
                    lvl: s[2],
                    sally: s[3],
                    extraSlot: s[4] === 1,
                    aa: s[6],
                    aa_max: master.stat.aa_max,
                    tp: s[7],
                    tp_max: master.stat.torpedo_max,
                    ar: s[8],
                    ar_max: master.stat.armor_max,
                    fp: s[9],
                    fp_max: master.stat.fire_max,
                    lk: s[10],
                    lk_max: master.stat.luck_max,
                    //hp
                    hp: s[11],
                    hp_def: master.stat.hp,
                    hp_max: master.stat.hp_max,
                    //asw
                    as: s[5],
                    as_def: master.stat.asw,
                    as_max: master.stat.asw_max,
                    los: master.stat.los + Math.floor((master.stat.los_max - master.stat.los) * s[2] / 99.0),
                    los_def: master.stat.los,
                    los_max: master.stat.los_max,
                    evasion: master.stat.evasion + Math.floor((master.stat.evasion_max - master.stat.evasion) * s[2] / 99.0),
                    evasion_def: master.stat.evasion,
                    evasion_max: master.stat.evasion_max,
                    nameEn: master.name.ja_romaji && master.name.ja_romaji !== "" ? master.name.ja_romaji : null,
                    nameJp: master.name.ja_jp && master.name.ja_jp !== "" ? master.name.ja_jp : null,
                    suffixEn: master.name.suffix_rj || null,
                    suffixJp: master.name.suffix_jp || null,
                    fast: master.stat.fast,
                    range: master.stat.range,
                    stype: master.stype,
                    slots: master.slot,
                    daihatsu: !!(master.daihatsu),
                    sortno: master.no
                });
                return true;
            }
        );
        tempShipsData = tempShipsData.map(
            (g) => {
                g.ships.sort((a, b) => {
                    if (a.lvl === b.lvl) {
                        if (a.sortno === b.sortno) {
                            return a.id - b.id;
                        } else {
                            return a.sortno - b.sortno;
                        }
                    } else {
                        return b.lvl - a.lvl;
                    }
                });
                return g;
            }
        );
        return tempShipsData;
    }

    getSType() {
        return this.stype.slice();
    }
}

const shipParser = new ShipParser();

export default shipParser;