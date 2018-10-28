// new custom modes would be based on this one
// see "senpoi" mode for details about each field
const basemode = {
    display: {
        ship: {
            fp: false,
            tp: false,
            ar: false,
            aa: false,
            lk: false,
            as: false,
            hp: false
        },
        hideMaxedMainStats: false
    },
    highlightMasterId: [],
    minLuck: 0,
    showInHeader: true,
    shipNameLanguage: "en"
};

const state = {
    modes: {
        regular: {/* build from basemode */},
        senpoi: {
            display: {
                // if stat is set as true it should be shown in ship box
                ship: {
                    fp: true,
                    tp: true,
                    ar: true,
                    aa: true,
                    as: false,
                    hp: false,
                    lk: true
                },
                // for stats fp tp ar aa
                // if it's >= max then it wouldn't be shown
                hideMaxedMainStats: true
            },
            // very usefull ships ids will go here
            // akashi is an example. everyone needs at least 1 akashi, right?
            highlightMasterId: [
                182, 187 //akashi ids
            ],
            // min required luck that will trigger luck icon show
            minLuck: 30,
            // Doing nothing right now.
            // But later on we can show bar in header with mode names,
            // so user will be able to fast switch between them
            showInHeader: true,
            // basically it wat it says. language that would be used for ship names
            // see navigator.language
            // and loadOptions() bellow
            shipNameLanguage: "en"
        }
    },
    currentMode: "regular"
};

Object.assign(state.modes.regular, basemode);

const getters = {
    optionsShip: state => state.modes[state.currentMode].display.ship,
    optionsHideMaxStat: state => state.modes[state.currentMode].display.hideMaxedMainStats,
    optionMinLuck: state => state.modes[state.currentMode].minLuck,
    optionShipNameLanguage: state => state.modes[state.currentMode].shipNameLanguage,
    highlightMasterShips: state => state.modes[state.currentMode].highlightMasterId,
    isSenpoiMode: state => state.currentMode === "senpoi",
    optionsModes: state => state.modes
};


const mutations = {
    toggleSenpoi(state) {
        state.currentMode = state.currentMode === "regular" ? "senpoi" : "regular";
        mutations.saveOptions(state);
    },
    saveOptions(state) {
        try {
            localStorage.setItem("kce_options", JSON.stringify(state));
        } catch (e) {
            console.error(e);
        }
    },
    loadOptions(state) {
        try {
            if (navigator.language !== "en" && (navigator.language === "ja" || navigator.languages && navigator.languages.indexOf('ja') !== -1)) {
                state.modes.regular.shipNameLanguage = "ja";
                state.modes.senpoi.shipNameLanguage = "ja";
            }
            let kce_options = JSON.parse(localStorage.getItem("kce_options"));
            Object.assign(state, kce_options);
        } catch (e) {
            console.error(e);
        }
    },
    updateOptionsDisplayStat(state, {modeName, statName, value}) {
        state.modes[modeName].display.ship[statName] = value;
        mutations.saveOptions(state);
    },
    setModeOptionTo(state, {modeName, optionName, value}) {
        state.modes[modeName][optionName] = value;
        mutations.saveOptions(state);
    },
    addToHighlights(state, {modeName, value}) {
        state.modes[modeName].highlightMasterId.push(value);
        mutations.saveOptions(state);
    },
    removeFromHighlights(state, {modeName, value}) {
        state.modes[modeName].highlightMasterId = state.modes[modeName].highlightMasterId.filter((v) => v !== value);
        mutations.saveOptions(state);
    },
    toggleHideMaxedMainStats(state,{modeName, value}) {
        state.modes[modeName].display.hideMaxedMainStats = value;
        mutations.saveOptions(state);
    }
};

const actions = {
    loadOptions(context) {
        context.commit('loadOptions');
    }
};

export default {state, getters, mutations, actions};