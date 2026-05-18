import { select as d3_select } from 'd3-selection';
import { dispatch as d3_dispatch } from 'd3-dispatch';

import { utilRebind } from '../../util';
import { uiField } from '../field.js';
import { presetField } from '../../presets';

/**
 * Custom field UI for Czech train signals
 */

const SignalType = {
    Main: 'main',
    Combined: 'combined',
    Minor: 'minor',
    Distant: 'distant',
    MinorDistant: 'minor_distant',
    Shunting: 'shunting',
    SpeedLimit: 'speed_limit',
    SpeedLimitDistant: 'speed_limit_distant',
    Stop: 'stop',
    Radio: 'radio',
    Crossing: 'crossing',
    CrossingHint: 'crossing_hint',
    StationDistant: 'station_distant',
    ResettingSwitch: 'resetting_switch',
    Whistle: 'whistle',
};

function getRootForType(type) {
    return `railway:signal:${type}`;
}

const SignalForm = {
    Light: 'light',
    Sign: 'sign',
};

const SignalHeight = {
    Tall: 'tall',
    Normal: 'normal',
    Short: 'short',
    Dwarf: 'dwarf',
};

const SignalVariant = {
    HlavniNavestidlo: 'CZ-D1:hlavni_navestidlo',

    SamostatnaPredvest: 'CZ-D1:samostatna_predvest',
    TabulkaSKrizem: 'CZ-D1:tabulka_s_krizem',

    SeradovaciNavestidlo: 'CZ-D1:seradovaci_navestidlo',
    VyckavaciNavestidlo: 'CZ-D1:vyckavaci_navestidlo',
    Oznacnik: 'CZ-D1:oznacnik',
    PosunZakazan: 'CZ-D1:posun_zakazan',

    RychlostnikN: 'CZ-D1:rychlostnik_n',
    HorniRychlostnikN: 'CZ-D1:horni_rychlostnik_n',
    RychlostnikNSPruhy: 'CZ-D1:rychlostnik_n_s_pruhy',
    RychlostnikNS: 'CZ-D1:rychlostnik_ns',
    RychlostnikR: 'CZ-D1:rychlostnik_r',

    PredvestnikN: 'CZ-D1:predvestnik_n',
    HorniPredvestnikN: 'CZ-D1:horni_predvestnik_n',
    PredvestnikNS: 'CZ-D1:predvestnik_ns',
    PredvestnikR: 'CZ-D1:predvestnik_r',

    Stuj: 'CZ-D1:stuj',
    Vystraha: 'CZ-D1:vystraha',

    LichobeznikovaTabulka: 'CZ-D1:lichobeznikova_tabulka',
    KonecNastupiste: 'CZ-D1:konec_nastupiste',
    MistoZastaveni: 'CZ-D1:misto_zastaveni',

    PredvestGsmRSite: 'CZ-D1:predvest_gsm-r_site',
    ZacatekGsmRSite: 'CZ-D1:zacatek_gsm-r_site',
    KonecGsmRSite: 'CZ-D1:konec_gsm-r_site',
    ZacatekAnalogoveSite: 'CZ-D1:zacatek_analogove_site',
    KonecAnalogoveSite: 'CZ-D1:konec_analogove_site',

    StitOp: 'CZ-D1:stit_op',
    Prejezdnik: 'CZ-D1:prejezdnik',

    NavestidloSloucenoSPredvesti: 'CZ-D1:hlavni_navestidlo_slouceno_s_predvesti',
    PosledniOddiloveNavestidlo: 'CZ-D1:stanoviste_posledniho_oddiloveho_navestidla',
    StanovisteSamostatnePredvesti: 'CZ-D1:stanoviste_samostatne_predvesti',
    VlakSeBliziKZastavce: 'CZ-D1:vlak_se_blizi_k_zastavce',

    NavestidloSamovratneVyhybky: 'CZ-D1:navestidlo_vyhybky_se_samovratnym_prestavnikem',
    Piskejte: 'CZ-D1:piskejte',
};

const SignalState = {
    Volno: 'CZ-D1:volno',
    OpakovaniVolno: 'CZ-D1:opakovani_volno',
    Vystraha: 'CZ-D1:vystraha',
    OpakovaniVystraha: 'CZ-D1:opakovani_vystraha',
    Stuj: 'CZ-D1:stuj',

    JizdaVlakuDovolena: 'CZ-D1:jizda_vlaku_dovolena',
    PosunDovolen: 'CZ-D1:posun_dovolen',
    PosunZakazan: 'CZ-D1:posun_zakazan',

    Off: 'off',
    Rychlost: i => `CZ-D1:rychlost_${i}`,
    Ocekavej: i => `CZ-D1:ocekavej_${i}`,
    Opakovani: i => `CZ-D1:opakovani_${i}`,

    JizdaNezajistena: 'CZ-D1:jizda_nezajistena',
    JizdaZajistena: 'CZ-D1:jizda_zajistena',
};

const StateOrder = [
    SignalState.Off,
    SignalState.Stuj,
    SignalState.OpakovaniVystraha,
    SignalState.Vystraha,
    SignalState.OpakovaniVolno,
    SignalState.Volno,
    SignalState.JizdaVlakuDovolena,
    SignalState.PosunZakazan,
    SignalState.PosunDovolen,
    SignalState.JizdaNezajistena,
    SignalState.JizdaZajistena
];

const Navestidlo = {
    NejakeNavestidlo: 'nejake_navestidlo',

    NejakeHlavni: 'nejake_hlavni',
    Hlavni: 'hlavni',

    NejakaPredvest: 'nejaka_predvest',
    SamostatnaPredvest: 'samostatna_predvest',
    OpakovaciPredvest: 'opakovaci_predvest',
    TabulkaSKrizem: 'tabulka_s_krizem',

    NejakeSeradovaci: 'nejake_seradovaci',
    Seradovaci: 'seradovaci',
    Vyckavaci: 'vyckavaci',
    Oznacnik: 'oznacnik',
    PosunZakazan: 'posun_zakazan',

    NejakyRychlostnik: 'nejaky_rychlostnik',
    RychlostnikN: 'rychlostnik_n',
    HorniRychlostnikN: 'horni_rychlostnik_n',
    RychlostnikNSPruhy: 'rychlostnik_n_s_pruhy',
    RychlostnikNS: 'rychlostnik_ns',
    RychlostnikR: 'rychlostnik_r',

    NejakyPredvestnik: 'nejak_predvestnik',
    PredvestnikN: 'predvestnik_n',
    HorniPredvestnikN: 'horni_predvestnik_n',
    PredvestnikNS: 'predvestnik_ns',
    PredvestnikR: 'predvestnik_r',

    Stuj: 'stuj',
    Vystraha: 'vystraha',

    NejakeZastaveni: 'nejake_zastaveni',
    LichobeznikovaTabulka: 'lichobeznikova_tabulka',
    KonecNastupiste: 'konec_nastupiste',
    MistoZastaveni: 'misto_zastaveni',
    MistoZastaveniOs: 'misto_zastaveni_os',

    NejakyRadiovnik: 'nejaky_radiovnik',
    ZacatekGsmRSite: 'zacatek_gsm-r_site',
    KonecGsmRSite: 'konec_gsm-r_site',
    ZacatekAnalogoveSite: 'zacatek_analogove_site',
    KonecAnalogoveSite: 'konec_analogove_site',
    PredvestGsmRSite: 'predvest_gsm-r_site',

    Prejezdnik: 'prejezdnik',

    NavestidloSloucenoSPredvesti: 'navestidlo_slouceno_s_predvesti',
    VlakSeBliziKZastavce: 'vlak_se_blizi_k_zastavce',

    NavestidloSamovratneVyhybky: 'navestidlo_samovratne_vyhybky',
    Piskejte: 'piskejte',
};

function getPrimaryTypeForNavestidlo(navestidlo) {
    switch (navestidlo) {
        case Navestidlo.NejakeHlavni:
        case Navestidlo.Hlavni:
        case Navestidlo.Stuj:
            return SignalType.Main;

        case Navestidlo.NejakaPredvest:
        case Navestidlo.SamostatnaPredvest:
        case Navestidlo.OpakovaciPredvest:
        case Navestidlo.Vystraha:
        case Navestidlo.TabulkaSKrizem:
            return SignalType.Distant;

        case Navestidlo.NejakeSeradovaci:
        case Navestidlo.Seradovaci:
        case Navestidlo.Vyckavaci:
        case Navestidlo.Oznacnik:
        case Navestidlo.PosunZakazan:
            return SignalType.Shunting;

        case Navestidlo.NejakyRychlostnik:
        case Navestidlo.RychlostnikN:
        case Navestidlo.HorniRychlostnikN:
        case Navestidlo.RychlostnikNSPruhy:
        case Navestidlo.RychlostnikNS:
        case Navestidlo.RychlostnikR:
            return SignalType.SpeedLimit;

        case Navestidlo.NejakyPredvestnik:
        case Navestidlo.PredvestnikN:
        case Navestidlo.HorniPredvestnikN:
        case Navestidlo.PredvestnikNS:
        case Navestidlo.PredvestnikR:
            return SignalType.SpeedLimitDistant;

        case Navestidlo.NejakeZastaveni:
        case Navestidlo.LichobeznikovaTabulka:
        case Navestidlo.KonecNastupiste:
        case Navestidlo.MistoZastaveni:
        case Navestidlo.MistoZastaveniOs:
            return SignalType.Stop;

        case Navestidlo.NejakyRadiovnik:
        case Navestidlo.PredvestGsmRSite:
        case Navestidlo.ZacatekGsmRSite:
        case Navestidlo.KonecGsmRSite:
        case Navestidlo.ZacatekAnalogoveSite:
        case Navestidlo.KonecAnalogoveSite:
            return SignalType.Radio;

        case Navestidlo.Prejezdnik:
            return SignalType.Crossing;

        case Navestidlo.VlakSeBliziKZastavce:
        case Navestidlo.NavestidloSloucenoSPredvesti:
            return SignalType.StationDistant;

        case Navestidlo.NavestidloSamovratneVyhybky:
            return SignalType.ResettingSwitch;

        case Navestidlo.Piskejte:
            return SignalType.Whistle;

        default:
            return null;
    }
}

function getVariantForNavestidlo(navestidlo) {
    switch (navestidlo) {
        case Navestidlo.Hlavni:
            return SignalVariant.HlavniNavestidlo;

        case Navestidlo.SamostatnaPredvest:
        case Navestidlo.OpakovaciPredvest:
            return SignalVariant.SamostatnaPredvest;
        case Navestidlo.TabulkaSKrizem:
            return SignalVariant.TabulkaSKrizem;

        case Navestidlo.Seradovaci:
            return SignalVariant.SeradovaciNavestidlo;
        case Navestidlo.Vyckavaci:
            return SignalVariant.VyckavaciNavestidlo;
        case Navestidlo.Oznacnik:
            return SignalVariant.Oznacnik;
        case Navestidlo.PosunZakazan:
            return SignalVariant.PosunZakazan;

        case Navestidlo.RychlostnikN:
            return SignalVariant.RychlostnikN;
        case Navestidlo.HorniRychlostnikN:
            return SignalVariant.HorniRychlostnikN;
        case Navestidlo.RychlostnikNSPruhy:
            return SignalVariant.RychlostnikNSPruhy;
        case Navestidlo.RychlostnikNS:
            return SignalVariant.RychlostnikNS;
        case Navestidlo.RychlostnikR:
            return SignalVariant.RychlostnikR;

        case Navestidlo.PredvestnikN:
            return SignalVariant.PredvestnikN;
        case Navestidlo.HorniPredvestnikN:
            return SignalVariant.HorniPredvestnikN;
        case Navestidlo.PredvestnikNS:
            return SignalVariant.PredvestnikNS;
        case Navestidlo.PredvestnikR:
            return SignalVariant.PredvestnikR;

        case Navestidlo.Stuj:
            return SignalVariant.Stuj;

        case Navestidlo.Vystraha:
            return SignalVariant.Vystraha;

        case Navestidlo.LichobeznikovaTabulka:
            return SignalVariant.LichobeznikovaTabulka;
        case Navestidlo.KonecNastupiste:
            return SignalVariant.KonecNastupiste;
        case Navestidlo.MistoZastaveni:
            return SignalVariant.MistoZastaveni;
        case Navestidlo.MistoZastaveniOs:
            return SignalVariant.MistoZastaveni;

        case Navestidlo.PredvestGsmRSite:
            return SignalVariant.PredvestGsmRSite;
        case Navestidlo.ZacatekGsmRSite:
            return SignalVariant.ZacatekGsmRSite;
        case Navestidlo.KonecGsmRSite:
            return SignalVariant.KonecGsmRSite;
        case Navestidlo.ZacatekAnalogoveSite:
            return SignalVariant.ZacatekAnalogoveSite;
        case Navestidlo.KonecAnalogoveSite:
            return SignalVariant.KonecAnalogoveSite;

        case Navestidlo.Prejezdnik:
            return SignalVariant.Prejezdnik;

        case Navestidlo.VlakSeBliziKZastavce:
            return SignalVariant.VlakSeBliziKZastavce;
        case Navestidlo.NavestidloSloucenoSPredvesti:
            return SignalVariant.NavestidloSloucenoSPredvesti;

        case Navestidlo.NavestidloSamovratneVyhybky:
            return SignalVariant.NavestidloSamovratneVyhybky;

        case Navestidlo.Piskejte:
            return SignalVariant.Piskejte;

        default:
            return 'CZ';
    }
}


function determineNavestidlo(tags) {

    if (getRootForType(SignalType.Main) in tags || getRootForType(SignalType.Combined) in tags) {
        if (tags[getRootForType(SignalType.Main)] === SignalVariant.HlavniNavestidlo) {
            return Navestidlo.Hlavni;
        }
        if (tags[getRootForType(SignalType.Combined)] === SignalVariant.HlavniNavestidlo) {
            return Navestidlo.Hlavni;
        }
        if (tags[getRootForType(SignalType.Main)] === SignalVariant.Stuj) {
            return Navestidlo.Stuj;
        }

        return Navestidlo.NejakeHlavni;

    } else if (getRootForType(SignalType.Distant) in tags) {

        if (tags[getRootForType(SignalType.Distant)] === SignalVariant.SamostatnaPredvest) {
            if (tags[getRootForType(SignalType.Distant) + ':repeated'] === 'yes') {
                return Navestidlo.OpakovaciPredvest;
            } else {
                return Navestidlo.SamostatnaPredvest;
            }
        }
        if (tags[getRootForType(SignalType.Distant)] === SignalVariant.Vystraha) {
            return Navestidlo.Vystraha;
        }
        if (tags[getRootForType(SignalType.Distant)] === SignalVariant.TabulkaSKrizem) {
            return Navestidlo.TabulkaSKrizem;
        }

        return Navestidlo.NejakaPredvest;
    } else if (getRootForType(SignalType.Shunting) in tags) {

        if (tags[getRootForType(SignalType.Shunting)] === SignalVariant.SeradovaciNavestidlo) {
            return Navestidlo.Seradovaci;
        }
        if (tags[getRootForType(SignalType.Shunting)] === SignalVariant.VyckavaciNavestidlo) {
            return Navestidlo.Vyckavaci;
        }
        if (tags[getRootForType(SignalType.Shunting)] === SignalVariant.Oznacnik) {
            return Navestidlo.Oznacnik;
        }
        if (tags[getRootForType(SignalType.Shunting)] === SignalVariant.PosunZakazan) {
            return Navestidlo.PosunZakazan;
        }

        return Navestidlo.NejakeSeradovaci;
    } else if (getRootForType(SignalType.SpeedLimit) in tags) {

        if (tags[getRootForType(SignalType.SpeedLimit)] === SignalVariant.RychlostnikN) {
            return Navestidlo.RychlostnikN;
        }
        if (tags[getRootForType(SignalType.SpeedLimit)] === SignalVariant.HorniRychlostnikN) {
            return Navestidlo.HorniRychlostnikN;
        }
        if (tags[getRootForType(SignalType.SpeedLimit)] === SignalVariant.RychlostnikNSPruhy) {
            return Navestidlo.RychlostnikNSPruhy;
        }
        if (tags[getRootForType(SignalType.SpeedLimit)] === SignalVariant.RychlostnikNS) {
            return Navestidlo.RychlostnikNS;
        }
        if (tags[getRootForType(SignalType.SpeedLimit)] === SignalVariant.RychlostnikR) {
            return Navestidlo.RychlostnikR;
        }

        return Navestidlo.NejakyRychlostnik;
    } else if (getRootForType(SignalType.SpeedLimitDistant) in tags) {

        if (tags[getRootForType(SignalType.SpeedLimitDistant)] === SignalVariant.PredvestnikN) {
            return Navestidlo.PredvestnikN;
        }
        if (tags[getRootForType(SignalType.SpeedLimitDistant)] === SignalVariant.HorniPredvestnikN) {
            return Navestidlo.HorniPredvestnikN;
        }
        if (tags[getRootForType(SignalType.SpeedLimitDistant)] === SignalVariant.PredvestnikNS) {
            return Navestidlo.PredvestnikNS;
        }
        if (tags[getRootForType(SignalType.SpeedLimitDistant)] === SignalVariant.PredvestnikR) {
            return Navestidlo.PredvestnikR;
        }

        return Navestidlo.NejakyPredvestnik;
    } else if (getRootForType(SignalType.Stop) in tags) {
        if (tags[getRootForType(SignalType.Stop)] === SignalVariant.LichobeznikovaTabulka) {
            return Navestidlo.LichobeznikovaTabulka;
        }
        if (tags[getRootForType(SignalType.Stop)] === SignalVariant.KonecNastupiste) {
            return Navestidlo.KonecNastupiste;
        }
        if (tags[getRootForType(SignalType.Stop)] === SignalVariant.MistoZastaveni) {
            if (tags[getRootForType(SignalType.Stop) + ':caption'] === 'Os') {
                return Navestidlo.MistoZastaveniOs;
            } else {
                return Navestidlo.MistoZastaveni;
            }
        }

        return Navestidlo.NejakeZastaveni;
    } else if (getRootForType(SignalType.Radio) in tags) {
        if (tags[getRootForType(SignalType.Radio)] === SignalVariant.PredvestGsmRSite) {
            return Navestidlo.PredvestGsmRSite;
        }
        if (tags[getRootForType(SignalType.Radio)] === SignalVariant.ZacatekGsmRSite) {
            return Navestidlo.ZacatekGsmRSite;
        }
        if (tags[getRootForType(SignalType.Radio)] === SignalVariant.KonecGsmRSite) {
            return Navestidlo.KonecGsmRSite;
        }
        if (tags[getRootForType(SignalType.Radio)] === SignalVariant.ZacatekAnalogoveSite) {
            return Navestidlo.ZacatekAnalogoveSite;
        }
        if (tags[getRootForType(SignalType.Radio)] === SignalVariant.KonecAnalogoveSite) {
            return Navestidlo.KonecAnalogoveSite;
        }

        return Navestidlo.NejakyRadiovnik;
    } else if (getRootForType(SignalType.Crossing) in tags) {
        if (tags[getRootForType(SignalType.Crossing)] === SignalVariant.Prejezdnik) {
            return Navestidlo.Prejezdnik;
        }
    } else if (getRootForType(SignalType.StationDistant) in tags) {
        if (tags[getRootForType(SignalType.StationDistant)] === SignalVariant.VlakSeBliziKZastavce) {
            return Navestidlo.VlakSeBliziKZastavce;
        }
        if (tags[getRootForType(SignalType.StationDistant)] === SignalVariant.NavestidloSloucenoSPredvesti) {
            return Navestidlo.NavestidloSloucenoSPredvesti;
        }
    } else if (getRootForType(SignalType.ResettingSwitch) in tags) {
        if (tags[getRootForType(SignalType.ResettingSwitch)] === SignalVariant.NavestidloSamovratneVyhybky) {
            return Navestidlo.NavestidloSamovratneVyhybky;
        }
    } else if (getRootForType(SignalType.Whistle) in tags) {
        if (tags[getRootForType(SignalType.Whistle)] === SignalVariant.Piskejte) {
            return Navestidlo.Piskejte;
        }
    }

    return Navestidlo.NejakeNavestidlo;

}

function renderButtonWall(selection, title, options, back, noMargin) {

    const entries = Object.entries(options || {}).map(([text, action]) => ({ text, action }));

    let wrapper = selection.selectAll('div.form-field')
        .data([0]);
    wrapper.exit().remove();
    wrapper = wrapper.enter()
        .append('div')
        .classed('form-field', true)
        .merge(wrapper);
    wrapper
        .style('margin-bottom', noMargin ? '0' : undefined);

    let label = wrapper.selectAll('label.field-label')
        .data([0]);
    label = label.enter()
        .append('label')
        .classed('field-label', true)
        .merge(label);


    let labelText = label.selectAll('span.label-text')
        .data([0]);
    labelText = labelText.enter()
        .append('span')
        .classed('label-text', true)
        .merge(labelText);
    labelText
        .text(title);


    let backButton = label.selectAll('button.back-btn')
        .data(back ? [0] : []);
    backButton.exit().remove();
    backButton = backButton.enter()
        .append('button')
        .classed('back-btn', true)
        .merge(backButton);

    let icon = backButton.selectAll('svg.icon')
        .data([0]);
    icon = icon.enter()
        .append('svg')
        .classed('icon', true)
        .merge(icon);

    let use = icon.selectAll('use')
        .data([0]);
    use = use.enter()
        .append('use')
        .attr('xlink:href', '#iD-icon-backward')
        .merge(use);

    backButton.on('click', back || null);


    let container = wrapper.selectAll('div.form-field-input-wrap')
        .data(entries.length > 0 ? [0] : []);
    container.exit().remove();
    container = container.enter()
        .append('div')
        .classed('form-field-input-wrap', true)
        .merge(container);

    let ul = container.selectAll('ul.chiplist')
        .data([0]);
    ul = ul.enter()
        .append('ul')
        .classed('chiplist', true)
        .style('padding', '8px')
        .merge(ul);

    let li = ul.selectAll('li')
        .data([0]);
    li = li.enter()
        .append('li')
        .style('display', 'grid')
        .style('grid-template-columns', 'repeat(auto-fit, minmax(120px, 1fr))')
        .style('gap', '8px')
        .style('width', '100%')
        .merge(li);

    let buttons = li.selectAll('button.option-btn')
        .data(entries, d => d.text);

    buttons.exit().remove();

    let buttonsEnter = buttons.enter()
        .append('button')
        .classed('option-btn', true)
        .style('width', '100%')
        .style('aspect-ratio', '2 / 1')
        .style('padding', '8px')
        .style('border', '1px solid #ccc');

    buttonsEnter.append('span');

    let buttonsMerged = buttonsEnter.merge(buttons);

    buttonsMerged.select('span').text(d => d.text);

    buttonsMerged.on('click', (event, d) => {
        if (d.action) d.action();
    });
}


function customPreset(rawPreset) {

    const { id, label, strings, ...rest } = rawPreset;

    const preset = presetField(id ?? 'custom', {
        ...rest,
        options: strings?.options ? Object.keys(strings?.options) : rawPreset?.options ?? [],
        overrideLabel: label
    });


    function getText(scope) {
        if (!scope?.startsWith('options.')) {
            return null;
        }

        const option = scope?.split('.')?.[1];
        const replacement = strings?.options?.[option];

        return replacement ?? null;
    }

    function modifyReplacements(scope, replacements) {
        const replacement = getText(scope);

        if (replacement !== null) {
            return {
                ...replacements,
                default: replacement,
            };
        }

        return replacements;
    }

    const t = preset.t;
    preset.t = (scope, replacements) => t(scope, modifyReplacements(scope, replacements));
    preset.t.html = (scope, replacements) => t.html(scope, modifyReplacements(scope, replacements));
    preset.t.append = (scope, replacements) => t.append(scope, modifyReplacements(scope, replacements));

    const hasTextForStringId = preset.hasTextForStringId;
    preset.hasTextForStringId = (scope) => getText(scope) !== null || hasTextForStringId(scope);

    return preset;
}

function uiFieldWrapper(context, preset, key, showInfo) {

    const dispatch = d3_dispatch('change');

    const field =
        uiField(
            context,
            customPreset(preset),
            [],
            {
                revert: false,
                remove: false,
                info: showInfo
            }
        )
            .on(
                'change',
                function (t, onInput) {
                    dispatch.call('change', this, t[key], onInput);
                }
            );

    const wrapper = {};

    wrapper.render = field.render;

    wrapper.value = function (value) {
        field.tags({ [key]: value });
        return wrapper;
    };

    return utilRebind(wrapper, dispatch, 'on');
}

function addMappingWrapper(func, opts) {

    const setterMapper = opts?.setterMapper ?? (v => v);

    const eventMapper = opts?.eventMapper ?? (v => v);

    return function () {

        const dispatch = d3_dispatch('change');

        const val = func(...arguments);
        val.on('change', e => dispatch.call('change', this, eventMapper(e)));

        const obj = {
            render: val.render,
            value: v => val.value(setterMapper(v)),
        };

        return utilRebind(obj, dispatch, 'on');
    };
}

function _customText(context, label, opts) {

    let { key } = opts ?? {};

    const actualKey = key ?? 'key';

    const preset = {
        key: actualKey,
        type: 'text',
        label,
        autoSuggestions: false
    };

    return uiFieldWrapper(context, preset, actualKey, !!key);
}

function _customDefaultCheck(context, label, opts) {

    let { key } = opts ?? {};

    const actualKey = key ?? 'key';

    const preset = {
        key: actualKey,
        type: 'defaultCheck',
        label,
        strings: {
            options: {
                'undefined': 'Ne',
                'yes': 'Ano'
            }
        }
    };

    return uiFieldWrapper(context, preset, actualKey, !!key);
}

function _customCombo(type, context, label, options, opts) {

    let { key, customValues } = opts ?? {};

    const actualKey = key ?? 'key';

    const preset = {
        key: actualKey,
        type: type,
        label,
        strings: { options },
        autoSuggestions: false,
        customValues: customValues ?? false,
    };

    return uiFieldWrapper(context, preset, actualKey, !!key);
}


export function uiFieldOrmczSignal(field, context) {

    const dispatch = d3_dispatch('change');


    let container = d3_select(null);
    let tags = {};

    let state = {
        reference: undefined,

        direction: undefined,
        position: undefined,
        height: undefined,
        catenary_mast: undefined,

        navestidlo: Navestidlo.NejakeNavestidlo,

        form: undefined,
        speed: undefined,
        substitute: undefined,

        functions: [],
        states: [],

        currentSpeeds: [],
        distantSpeeds: [],

        slouceno_s_predvesti: undefined,
        posledni_autoblok: undefined,
        predvest_type: 'no',
        stit_op: undefined,

        caption: undefined,
        repeated: undefined,
        shortened: undefined,
        immediate: undefined,

        frequency: undefined,
        deactivated: undefined,
    };


    function watchProperty(obj, propertyName, propValue) {
        return new Proxy(obj, {
            set(target, prop, value, receiver) {
                if (prop === propertyName && value === propValue) {
                    debugger; // execution pauses here
                }
                return Reflect.set(target, prop, value, receiver);
            }
        });
    }

    state = watchProperty(state, 'navestidlo', Navestidlo.NejakeNavestidlo);


    function loadTags(newTags) {
        tags = { ...newTags };

        let reapply = false;

        state.reference = tags.ref;

        state.direction = tags['railway:signal:direction'] || state.direction;
        state.position = tags['railway:signal:position'] || state.position;
        state.catenary_mast = tags['railway:signal:catenary_mast'] || state.catenary_mast;

        if (state.direction === 'backward') {
            if (tags['railway:signal:position'] === 'left') {
                state.position = 'right';
                reapply = true;
            }
            if (tags['railway:signal:position'] === 'right') {
                state.position = 'left';
                reapply = true;
            }
        }

        if (state.position === undefined) {
            if ([
                Navestidlo.Stuj,
                Navestidlo.PosunZakazan,
            ].includes(state.navestidlo)) {
                state.position = 'in_track';
                reapply = true;
            } else {
                state.position = 'right';
            }
            reapply = true;
        }

        state.navestidlo = determineNavestidlo(tags);

        let primaryType = getPrimaryTypeForNavestidlo(state.navestidlo);
        if (primaryType === SignalType.Main && getRootForType(SignalType.Combined) in tags) {
            primaryType = SignalType.Combined;
        }
        let primaryRoot = getRootForType(primaryType);

        state.form = tags[primaryRoot + ':form'] || state.form;
        if (!Object.values(SignalForm).includes(state.form)) {
            state.form = undefined;
        }

        state.height = tags[primaryRoot + ':height'] || state.height;
        if (!Object.values(SignalHeight).includes(state.height)) {
            state.height = undefined;
        }

        if (state.height === undefined) {
            if ([
                Navestidlo.Hlavni,
                Navestidlo.SamostatnaPredvest,
                Navestidlo.OpakovaciPredvest,
                Navestidlo.Prejezdnik,
                Navestidlo.Vyckavaci,
            ].includes(state.navestidlo)) {
                state.height = SignalHeight.Normal;
                reapply = true;
            } else if ([
                Navestidlo.NavestidloSamovratneVyhybky
            ].includes(state.navestidlo)) {
                state.height = SignalHeight.Short;
                reapply = true;
            } else if ([
                Navestidlo.Seradovaci
            ].includes(state.navestidlo)) {
                state.height = SignalHeight.Dwarf;
                reapply = true;
            }
        }


        state.speed = tags[primaryRoot + ':speed'] || state.speed;

        state.functions =
            (tags[primaryRoot + ':function'] || null)
                ?.split(';')?.map(s => s.trim()) || Array.from(state.functions);


        state.substitute = tags[primaryRoot + ':substitute_signal'] || state.substitute;
        if (state.substitute === 'yes') {
            state.substitute = 'CZ-D1:privolavaci_navest';
            reapply = true;
        }

        if (state.substitute === undefined && state.functions.length > 0) {
            if (state.functions.includes('entry') || state.functions.includes('intermediate') || state.functions.includes('exit')) {
                state.substitute = 'CZ-D1:privolavaci_navest';
                reapply = true;
            } else if (state.functions.includes('block') || state.functions.includes('protection')) {
                state.substitute = 'no';
                reapply = true;
            }

        }


        state.states =
            (tags[primaryRoot + ':states'] || null)
                ?.split(';')?.map(s => s.trim()) || Array.from(state.states);

        if (state.states.length === 0) {
            switch (state.navestidlo) {
                case Navestidlo.Hlavni:
                    if (state.functions.length === 0) {
                        break;
                    }
                    if (state.functions.includes('entry') || state.functions.includes('block')) {
                        state.states = [SignalState.Stuj, SignalState.Vystraha, SignalState.Volno];
                        reapply = true;
                    } else if (state.functions.includes('intermediate') || state.functions.includes('exit')) {
                        state.states = [SignalState.Stuj, SignalState.Vystraha, SignalState.Volno, SignalState.PosunDovolen];
                        reapply = true;
                    } else if (state.functions.includes('protection')) {
                        state.states = [SignalState.Stuj, SignalState.Volno];
                        reapply = true;
                    }
                    break;
                case Navestidlo.OpakovaciPredvest:
                    state.states = [SignalState.OpakovaniVystraha, SignalState.OpakovaniVolno];
                    reapply = true;
                    break;
                case Navestidlo.SamostatnaPredvest:
                    state.states = [SignalState.Vystraha, SignalState.Volno];
                    reapply = true;
                    break;
                case Navestidlo.Seradovaci:
                    state.states = [SignalState.PosunZakazan, SignalState.PosunDovolen];
                    reapply = true;
                    break;
            }
        }


        state.currentSpeeds =
            (tags[getRootForType(SignalType.SpeedLimit) + ':states'] || null)
                ?.split(';')?.map(s => s.trim()) || Array.from(state.currentSpeeds);


        state.distantSpeeds =
            (tags[getRootForType(SignalType.SpeedLimitDistant) + ':states'] || null)
                ?.split(';')?.map(s => s.trim()) || Array.from(state.distantSpeeds);


        if (tags[getRootForType(SignalType.StationDistant)] === SignalVariant.NavestidloSloucenoSPredvesti) {
            state.slouceno_s_predvesti = 'yes';
        }

        if (tags[getRootForType(SignalType.StationDistant)] === SignalVariant.PosledniOddiloveNavestidlo) {
            state.posledni_autoblok = 'yes';
        }

        if (tags[getRootForType(SignalType.StationDistant)] === SignalVariant.StanovisteSamostatnePredvesti) {
            state.predvest_type = tags[getRootForType(SignalType.StationDistant) + ':type'] ?? 'yes';
        } else {
            state.predvest_type = 'no';
        }

        if (tags[getRootForType(SignalType.CrossingHint)] === SignalVariant.StitOp) {
            state.stit_op = 'yes';
        }

        state.caption = tags[primaryRoot + ':caption'];
        state.frequency = tags[primaryRoot + ':frequency'];
        state.repeated = tags[primaryRoot + ':repeated'];
        state.shortened = tags[primaryRoot + ':shortened'];
        state.deactivated = tags[primaryRoot + ':deactivated'];

        if ([
            Navestidlo.NejakyRychlostnik,
            Navestidlo.RychlostnikN,
            Navestidlo.HorniRychlostnikN,
            Navestidlo.RychlostnikNSPruhy,
            Navestidlo.RychlostnikNS,
            Navestidlo.RychlostnikR
        ].includes(state.navestidlo)) {
            state.immediate = tags[primaryRoot + ':type'] === 'immediate' ? 'yes' : undefined;
        }

        if (reapply) {
            setTimeout(updateTags);
        }
    }

    function updateTags() {

        const computedTags = {};


        computedTags['railway:signal:position'] = state.position;
        if (state.direction === 'backward') {
            if (state.position === 'left') computedTags['railway:signal:position'] = 'right';
            if (state.position === 'right') computedTags['railway:signal:position'] = 'left';
        }
        computedTags['railway:signal:direction'] = state.direction;


        let primaryType = getPrimaryTypeForNavestidlo(state.navestidlo);
        if (primaryType !== null) {

            let variant = getVariantForNavestidlo(state.navestidlo);

            if (primaryType === SignalType.Main && variant === SignalVariant.HlavniNavestidlo) {
                if (state.distantSpeeds.length > 0
                    || state.states.includes(SignalState.Vystraha)
                    || state.states.includes(SignalState.OpakovaniVystraha)
                ) {
                    primaryType = SignalType.Combined;
                }
            }


            const primaryRoot = getRootForType(primaryType);
            computedTags[primaryRoot] = variant;


            // Form
            if (
                [
                    Navestidlo.Hlavni,
                    Navestidlo.SamostatnaPredvest,
                    Navestidlo.OpakovaciPredvest,
                    Navestidlo.Seradovaci
                ].includes(state.navestidlo)
            ) {
                computedTags[primaryRoot + ':form'] = SignalForm.Light;
            } else if (
                [
                    Navestidlo.Vyckavaci,
                    Navestidlo.Prejezdnik
                ].includes(state.navestidlo)
            ) {
                computedTags[primaryRoot + ':form'] = state.form ?? SignalForm.Sign;
            } else {
                computedTags[primaryRoot + ':form'] = SignalForm.Sign;
            }

            // Height
            if (
                state.height !== undefined &&
                [
                    Navestidlo.Hlavni,
                    Navestidlo.SamostatnaPredvest,
                    Navestidlo.OpakovaciPredvest,
                    Navestidlo.Seradovaci,
                    Navestidlo.Prejezdnik,
                    Navestidlo.NavestidloSamovratneVyhybky
                ].includes(state.navestidlo)
                &&
                [
                    'left',
                    'right'
                ].includes(state.position)
            ) {
                computedTags[primaryRoot + ':height'] = state.height;
            }

            // Speed (basic speed for signs)
            if (
                state.speed !== undefined &&
                [
                    Navestidlo.NejakyRychlostnik,
                    Navestidlo.RychlostnikN,
                    Navestidlo.HorniRychlostnikN,
                    Navestidlo.RychlostnikNSPruhy,
                    Navestidlo.RychlostnikNS,
                    Navestidlo.RychlostnikR,
                    Navestidlo.NejakyPredvestnik,
                    Navestidlo.PredvestnikN,
                    Navestidlo.HorniPredvestnikN,
                    Navestidlo.PredvestnikNS,
                    Navestidlo.PredvestnikR
                ].includes(state.navestidlo)
            ) {
                computedTags[primaryRoot + ':speed'] = state.speed;
            }

            // substitute signal
            // function
            if (
                [
                    Navestidlo.Hlavni
                ].includes(state.navestidlo)
            ) {
                if (state.substitute !== undefined) {
                    computedTags[primaryRoot + ':substitute_signal'] = state.substitute;
                }
                if (state.functions.length > 0) {
                    computedTags[primaryRoot + ':function'] = state.functions.join(';');
                }
                if (state.stit_op === 'yes') {
                    computedTags[getRootForType(SignalType.CrossingHint)] = SignalVariant.StitOp;
                    computedTags[getRootForType(SignalType.CrossingHint) + ':form'] = SignalForm.Sign;
                }
                if (state.slouceno_s_predvesti === 'yes') {
                    computedTags[getRootForType(SignalType.StationDistant)] = SignalVariant.NavestidloSloucenoSPredvesti;
                    computedTags[getRootForType(SignalType.StationDistant) + ':form'] = SignalForm.Sign;
                }
                if (state.posledni_autoblok === 'yes') {
                    computedTags[getRootForType(SignalType.StationDistant)] = SignalVariant.PosledniOddiloveNavestidlo;
                    computedTags[getRootForType(SignalType.StationDistant) + ':form'] = SignalForm.Sign;
                }
            }

            // distant minor
            if (
                [
                    Navestidlo.SamostatnaPredvest
                ].includes(state.navestidlo)
            ) {
                if (state.predvest_type !== 'no') {
                    computedTags[getRootForType(SignalType.StationDistant)] = SignalVariant.StanovisteSamostatnePredvesti;
                    if (state.predvest_type !== 'yes') {
                        computedTags[getRootForType(SignalType.StationDistant) + ':type'] = state.predvest_type;
                    }
                    computedTags[getRootForType(SignalType.StationDistant) + ':form'] = SignalForm.Sign;
                }
            }

            // repeated
            if (
                [
                    Navestidlo.OpakovaciPredvest
                ].includes(state.navestidlo)
            ) {
                computedTags[primaryRoot + ':repeated'] = 'yes';
            }

            if (
                [
                    Navestidlo.NejakyRychlostnik,
                    Navestidlo.RychlostnikN,
                    Navestidlo.HorniRychlostnikN,
                    Navestidlo.RychlostnikNSPruhy,
                    Navestidlo.RychlostnikNS,
                    Navestidlo.RychlostnikR,
                    Navestidlo.NejakyPredvestnik,
                    Navestidlo.PredvestnikN,
                    Navestidlo.HorniPredvestnikN,
                    Navestidlo.PredvestnikNS,
                    Navestidlo.PredvestnikR,
                    Navestidlo.Oznacnik,
                    Navestidlo.NavestidloSloucenoSPredvesti
                ].includes(state.navestidlo)
            ) {
                if (state.catenary_mast === 'yes') {
                    computedTags['railway:signal:catenary_mast'] = 'yes';
                }
            }

            if ([
                Navestidlo.NejakyRychlostnik,
                Navestidlo.RychlostnikN,
                Navestidlo.HorniRychlostnikN,
                Navestidlo.RychlostnikNSPruhy,
                Navestidlo.RychlostnikNS,
                Navestidlo.RychlostnikR
            ].includes(state.navestidlo)) {
                if (state.immediate === 'yes') {
                    computedTags[primaryRoot + ':type'] = 'immediate';
                }
            }

            if (
                [
                    Navestidlo.NejakyPredvestnik,
                    Navestidlo.PredvestnikN,
                    Navestidlo.HorniPredvestnikN,
                    Navestidlo.PredvestnikNS,
                    Navestidlo.PredvestnikR,
                    Navestidlo.VlakSeBliziKZastavce
                ].includes(state.navestidlo)
            ) {
                if (state.shortened === 'yes') {
                    computedTags[primaryRoot + ':shortened'] = 'yes';
                }
            }

            if (state.deactivated === 'yes') {
                computedTags[primaryRoot + ':deactivated'] = 'yes';
            }

            // states
            if (
                [
                    Navestidlo.Hlavni,
                    Navestidlo.SamostatnaPredvest,
                    Navestidlo.OpakovaciPredvest,
                    Navestidlo.Seradovaci,
                    Navestidlo.NavestidloSamovratneVyhybky
                ].includes(state.navestidlo)
            ) {
                if (state.states.length > 0) {
                    state.states = [
                        ...StateOrder.filter(x => state.states.includes(x)),
                        ...state.states.filter(x => !StateOrder.includes(x))
                    ];
                    computedTags[primaryRoot + ':states'] = state.states.join(';');
                }
            } else if (
                [
                    Navestidlo.Vyckavaci
                ].includes(state.navestidlo)
            ) {
                computedTags[primaryRoot + ':states'] =
                    'CZ-D1:posun_zakazan' + (state.form === SignalForm.Light ? ';CZ-D1:posun-dovolen' : '');
            } else if (
                [
                    Navestidlo.Prejezdnik
                ].includes(state.navestidlo)
            ) {
                computedTags[primaryRoot + ':states'] =
                    'CZ-D1:otevreny_prejezd' + (state.form === SignalForm.Light ? ';CZ-D1:uzavreny_prejezd' : '');
            }

            if (
                [
                    Navestidlo.RychlostnikNS,
                    Navestidlo.PredvestnikNS
                ].includes(state.navestidlo)
            ) {
                computedTags[primaryRoot + ':for'] = 'tilting';
            }

            if (
                [
                    Navestidlo.Hlavni
                ].includes(state.navestidlo)
                &&
                (state.currentSpeeds.length > 0)
            ) {

                computedTags[getRootForType(SignalType.SpeedLimit)] = variant;
                computedTags[getRootForType(SignalType.SpeedLimit) + ':form'] = 'light';

                const speeds = state.currentSpeeds
                    .map(str => {
                        let str2 = str;
                        if (str === SignalState.Off) {
                            return [0, SignalState.Off];
                        }
                        if (str.startsWith('CZ-D1:')) {
                            str2 = str.substring('CZ-D1:'.length);
                        }
                        return [Number(str2.match(/\d+/)?.[0]), str];
                    })
                    .sort((a, b) => a[0] - b[0]);

                computedTags[getRootForType(SignalType.SpeedLimit) + ':states'] = speeds
                    .map(([_, str]) => str)
                    .join(';');

                computedTags[getRootForType(SignalType.SpeedLimit) + ':speed']
                    = [...new Set(speeds.map(([val]) => val))]
                    .sort((a, b) => a - b)
                    .map(a => a ? a : 'none')
                    .join(';');
            }


            if (
                [
                    Navestidlo.Hlavni,
                    Navestidlo.SamostatnaPredvest,
                    Navestidlo.OpakovaciPredvest
                ].includes(state.navestidlo)
                &&
                (state.distantSpeeds.length > 0)
            ) {

                computedTags[getRootForType(SignalType.SpeedLimitDistant)] = variant;
                computedTags[getRootForType(SignalType.SpeedLimitDistant) + ':form'] = 'light';

                const speeds = state.distantSpeeds
                    .map(str => {
                        let str2 = str;
                        if (str === SignalState.Off) {
                            return [0, SignalState.Off];
                        }
                        if (str.startsWith('CZ-D1:')) {
                            str2 = str.substring('CZ-D1:'.length);
                        }
                        return [Number(str2.match(/\d+/)?.[0]), str];
                    })
                    .sort((a, b) => {
                        // First compare numerically by first key
                        const numA = a[0];
                        const numB = b[0];
                        if (numA !== numB) return numA - numB;

                        // Then lexicographically by second key
                        return a[1].localeCompare(b[1]);
                    });


                computedTags[getRootForType(SignalType.SpeedLimitDistant) + ':states'] = speeds
                    .map(([_, str]) => str)
                    .join(';');

                let distantTags
                    = [...new Set(speeds.map(([val]) => val))]
                    .sort((a, b) => a - b)
                    .map(a => a ? a : 'none')
                    .join(';');

                if (!distantTags.includes('none') && state.states.includes(SignalState.Volno)) {
                    distantTags = 'none;' + distantTags;
                }

                computedTags[getRootForType(SignalType.SpeedLimitDistant) + ':speed'] = distantTags;
            }

            if (!!state.caption && state.navestidlo === Navestidlo.LichobeznikovaTabulka) {
                computedTags[primaryRoot + ':caption'] = state.caption;
            }

            if (!!state.caption && state.navestidlo === Navestidlo.Piskejte) {
                computedTags[primaryRoot + ':caption'] = state.caption;
            }

            if (!!state.frequency && state.navestidlo === Navestidlo.ZacatekAnalogoveSite) {
                computedTags[primaryRoot + ':frequency'] = state.frequency;
            }

            if (state.navestidlo === Navestidlo.Prejezdnik) {

                if (state.caption) {
                    computedTags[primaryRoot + ':caption'] = state.caption;
                }

                if (state.repeated === 'yes') {
                    computedTags[primaryRoot + ':repeated'] = 'yes';
                }

            }

            if (state.navestidlo === Navestidlo.MistoZastaveniOs) {
                computedTags[primaryRoot + ':caption'] = 'Os';
            }

        }

        const tagsModifier = (oldTags) => {
            const unrelatedTags = { ...oldTags };

            for (let key in unrelatedTags) {
                if (
                    ['railway:signal:position', 'railway:signal:direction', 'railway:signal:catenary_mast'].includes(key) ||
                    Object.values(SignalType).some(variant => key.startsWith(`railway:signal:${variant}`))
                ) {
                    delete unrelatedTags[key];
                }
            }

            return { ...unrelatedTags, ...computedTags };
        };

        tags = tagsModifier(tags);
        dispatch.call('change', this, tagsModifier);
    }


    function changeState(update) {
        const oldNavestidlo = state.navestidlo;
        const newNavestidlo = update.navestidlo;

        state = { ...state, ...update };
        updateTags();

        if (newNavestidlo && newNavestidlo === oldNavestidlo) // TODO: this checking could be improved
        {
            render(views.forNavestidlo[newNavestidlo ?? oldNavestidlo]);
        }
    }

    function renderChildInputs(selection, inputs) {

        let wrap = selection.selectAll('.wrap-form-field')
            .data(inputs);

        wrap.exit()
            .remove();

        wrap = wrap.enter()
            .append('div')
            .classed('wrap-form-field', true)
            .merge(wrap);

        wrap.each(function (field) {
            field.render(d3_select(this));
        });
    }

    function render(view) {

        let { title, shortcuts, inputs, back } = (view ?? views.default)();

        title ??= 'Nastavení návěstidla';
        shortcuts ??= {};
        inputs ??= [];
        back ??= null;

        renderButtonWall(container, title, shortcuts, back, inputs.length === 0);
        renderChildInputs(container, inputs);
    }


    function thenChangeState(update) {
        return () => changeState(update);
    }

    function thenChangeStateOf(key) {
        return value => changeState({ [key]: value });
    }

    function thenRenderView(view) {
        return () => render(view);
    }

    function thenRenderFor(navs) {
        return () => render(views.forNavestidlo[navs]);
    }


    // Custom functions for fast ui creation
    function makeAttachable(func, opts) {

        return function () {
            const val = func(...arguments);

            val.attach = (value, listener) => {
                val.value(value);
                val.on('change', listener);
                return val;
            };

            val.attachTo = (key) => {
                val.attach(state[key], thenChangeStateOf(key));
                return val;
            };

            return val;
        };
    }

    const _text = _customText.bind(null, context);
    const _defaultCheck = _customDefaultCheck.bind(null, context);
    const _select = _customCombo.bind(null, 'combo', context);
    const _multiSelect = addMappingWrapper(
        _customCombo.bind(null, 'semiCombo', context),
        {
            setterMapper: arr => arr.join(';'),
            eventMapper: str => str?.split(';')
                ?.map(s => s.trim())
                ?.filter(s => s.length > 0) ?? []
        }
    );

    const uiText = makeAttachable(_text);
    const uiDefaultCheck = makeAttachable(_defaultCheck);
    const uiSelect = makeAttachable(_select);
    const uiMultiSelect = makeAttachable(_multiSelect);


    function ormczSignal(selection) {
        selection.classed('compound-field', true);

        container = selection.selectAll('.child-fields-container')
            .data([0]);

        container = container.enter()
            .append('div')
            .classed('child-fields-container', true)
            .merge(container);
    }

    const templates = {};

    templates.SignalDirection = () => uiSelect('Směr',
        {
            'forward': 'Vpřed',
            'backward': 'Vzad',
        }
    ).attachTo('direction');

    templates.SignalPosition_LightSignals = () => uiSelect('Pozice',
        {
            'left': 'Vlevo',
            'right': 'Vpravo',
            'bridge': 'Lávka',
        }
    ).attachTo('position');

    templates.SignalHeight_LightSignals = () => uiSelect('Výška',
        {
            [SignalHeight.Normal]: 'Stožárové',
            [SignalHeight.Dwarf]: 'Trpasličí',
            [SignalHeight.Short]: 'Nízké',
            [SignalHeight.Tall]: 'Vysoké',
        }
    ).attachTo('height');

    templates.LightSignalPositioning = () => {

        if (['left', 'right'].includes(state.position)) {
            return [
                templates.SignalDirection(),
                templates.SignalPosition_LightSignals(),
                templates.SignalHeight_LightSignals()
            ];
        } else {
            return [
                templates.SignalDirection(),
                templates.SignalPosition_LightSignals(),
            ];
        }
    };


    templates.SignalPosition_LeftRightOnlySignals = () => uiSelect('Pozice',
        {
            'left': 'Vlevo',
            'right': 'Vpravo',
        }
    ).attachTo('position');

    templates.SignalOnCatenaryMast = () => uiDefaultCheck('Umístěn na sloupu trakčního vedení')
        .attachTo('catenary_mast');

    templates.SignalDeactivated = () => uiDefaultCheck('Deaktivováno')
        .attachTo('deactivated');

    templates.SpeedSignalPositioning = () => {
        return [
            templates.SignalDirection(),
            templates.SignalPosition_LeftRightOnlySignals(),
            templates.SignalOnCatenaryMast()
        ];
    };

    templates.LeftRightOnlySignalPositioning = () => {
        return [
            templates.SignalDirection(),
            templates.SignalPosition_LeftRightOnlySignals(),
        ];
    };

    templates.SignalPosition_Anywhere = () => uiSelect('Pozice',
        {
            'left': 'Vlevo',
            'right': 'Vpravo',
            'bridge': 'Lávka',
            'in_track': 'Mezi kolejemmi',
            'overhead': 'Na trolejovém vedení',
        }
    ).attachTo('position');

    templates.AnywhereSignalPositioning = () => {
        return [
            templates.SignalDirection(),
            templates.SignalPosition_Anywhere(),
        ];
    };

    templates.SpeedsOfRychlostnik = (add_NS_End) => uiSelect('Rychlost',
        (() => {
            const options = {};
            for (let i = 5; i <= 160; i += 5) {
                options[`${i}`] = `${i}`;
            }
            if (add_NS_End) {
                options.none = 'Konec NS';
            }
            return options;
        })(),
        { customValues: true }
    ).attachTo('speed');

    templates.SpeedsOfPredvestnik = (add_NS_End) => uiSelect('Rychlost',
        (() => {
            const options = { '5': '5' };
            for (let i = 10; i <= 160; i += 10) {
                options[`${i}`] = `${i}`;
            }
            if (add_NS_End) {
                options.none = 'Konec NS';
            }
            return options;
        })(),
        { customValues: true }
    ).attachTo('speed');


    const views = {};
    views.forNavestidlo = {};

    views.default = () => {
        const title = 'Vyberte typ návěstidla';

        const shortcuts = {
            'Hlavní návěstidlo': thenChangeState({
                navestidlo: Navestidlo.Hlavni,
            }),
            'Seřaďovací návěstidlo': thenChangeState({
                navestidlo: Navestidlo.Seradovaci,
            }),
            'Rychlostník': thenChangeState({
                navestidlo: Navestidlo.NejakyRychlostnik,
            }),
            'Předvěstník': thenChangeState({
                navestidlo: Navestidlo.NejakyPredvestnik,
            }),
            'Radiovník': thenChangeState({
                navestidlo: Navestidlo.NejakyRadiovnik,
            }),
            'Zastávky': thenChangeState({
                navestidlo: Navestidlo.NejakeZastaveni,
            }),
            'Jiná světelná': thenRenderView(views.JinaSvetelna),
            'Jiná neproměnná': thenRenderView(views.CedulkyApod),
        };

        return { title, shortcuts };
    };

    views.JinaSvetelna = () => {
        const title = 'Vyberte typ světelného návěstidla';

        const shortcuts = {
            'Samostatná předvěst': thenChangeState({
                navestidlo: Navestidlo.SamostatnaPredvest,
            }),
            'Opakovací předvěst': thenChangeState({
                navestidlo: Navestidlo.OpakovaciPredvest,
            }),
            'Světelný přejezdník': thenChangeState({
                navestidlo: Navestidlo.Prejezdnik,
                form: SignalForm.Light
            }),
            'Samovratná výhybka': thenChangeState({
                navestidlo: Navestidlo.NavestidloSamovratneVyhybky,
            }),
            'Světelné vyčkávací': thenChangeState({
                navestidlo: Navestidlo.Vyckavaci,
                form: SignalForm.Light
            }),
        };

        const back = thenRenderFor(Navestidlo.NejakeNavestidlo);

        return { title, shortcuts, back };
    };

    views.CedulkyApod = () => {
        const title = 'Vyberte typ neproměnného návěstidla';

        const shortcuts = {
            'Návěst posun zakázán': thenChangeState({
                navestidlo: Navestidlo.PosunZakazan,
            }),
            'Označník': thenChangeState({
                navestidlo: Navestidlo.Oznacnik,
            }),
            'Pískejte': thenChangeState({
                navestidlo: Navestidlo.Piskejte,
            }),
            'Tabulka s křížem': thenChangeState({
                navestidlo: Navestidlo.TabulkaSKrizem,
            }),
            'Sloučeno s předvěstí': thenChangeState({
                navestidlo: Navestidlo.NavestidloSloucenoSPredvesti,
            }),
            'Neproměnný přejezdník': thenChangeState({
                navestidlo: Navestidlo.Prejezdnik,
                form: SignalForm.Sign,
            }),
            'Neproměnné vyčkávací': thenChangeState({
                navestidlo: Navestidlo.Vyckavaci,
                form: SignalForm.Sign,
            }),
            'Návěst stůj': thenChangeState({
                navestidlo: Navestidlo.Stuj,
            }),
            'Návěst výstraha': thenChangeState({
                navestidlo: Navestidlo.Vystraha,
            }),
        };

        const back = thenRenderFor(Navestidlo.NejakeNavestidlo);

        return { title, shortcuts, back };
    };

    views.forNavestidlo[Navestidlo.NejakeNavestidlo] = views.default;

    views.forNavestidlo[Navestidlo.Hlavni] = () => {
        const title = 'Hlavní návěstidlo';

        const inputs = [
            ...templates.LightSignalPositioning(),

            uiMultiSelect('Funkce',
                {
                    entry: 'Vjezdové',
                    exit: 'Odjezdové',
                    intermediate: 'Cestové',
                    block: 'Oddílové',
                    protection: 'Krycí'
                }
            ).attachTo('functions'),

            uiMultiSelect('Základní návěsti',
                {
                    [SignalState.Stuj]: 'Stůj',
                    [SignalState.Volno]: 'Volno',
                    [SignalState.Vystraha]: 'Výstraha',
                    [SignalState.PosunDovolen]: 'Posun dovolen',
                    [SignalState.OpakovaniVystraha]: 'Opakování výstrahy',
                    [SignalState.JizdaVlakuDovolena]: 'Jízda vlaku dovolena',
                }
            ).attachTo('states'),

            uiMultiSelect('Omezení rychlosti',
                (() => {
                    const options = {
                        [SignalState.Off]: 'Bez omezení'
                    };
                    for (let i = 30; i <= 160; i += 10) {
                        options[`CZ-D1:rychlost_${i}`] = `${i}`;
                    }
                    return options;
                })()
            ).attachTo('currentSpeeds'),

            uiMultiSelect('Předvěst rychlosti',
                (() => {
                    const options = {};
                    for (let i = 40; i <= 160; i += 20) {
                        options[`CZ-D1:ocekavej_${i}`] = `${i}`;
                    }
                    for (let i = 40; i <= 160; i += 20) {
                        options[`CZ-D1:opakovani_${i}`] = `Opakování ${i}`;
                    }
                    return options;
                })()
            ).attachTo('distantSpeeds'),

            uiSelect('Přivolávací návěst', {
                'no': 'Ne',
                'CZ-D1:privolavaci_navest': 'Ano',
            }, {
                customValues: true
            }).attachTo('substitute'),

            uiDefaultCheck('Štít Op').attachTo('stit_op'),
            uiDefaultCheck('Návěstidlo sloučeno s předvěstí').attachTo('slouceno_s_predvesti'),
            uiDefaultCheck('Poslední oddílové návěstidlo').attachTo('posledni_autoblok'),
            templates.SignalDeactivated()
        ];

        const back = thenRenderFor(Navestidlo.NejakeNavestidlo);

        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.NejakaPredvest] = views.default;

    views.forNavestidlo[Navestidlo.SamostatnaPredvest] = () => {
        const title = 'Samostatná předvěst';

        const inputs = [
            ...templates.LightSignalPositioning(),

            uiMultiSelect('Základní návěsti',
                {
                    [SignalState.Volno]: 'Volno',
                    [SignalState.Vystraha]: 'Výstraha',
                }
            ).attachTo('states'),

            uiMultiSelect('Omezení rychlosti',
                (() => {
                    const options = {};
                    for (let i = 40; i <= 160; i += 20) {
                        options[`CZ-D1:ocekavej_${i}`] = `${i}`;
                    }
                    return options;
                })()
            ).attachTo('distantSpeeds'),

            uiSelect('Stanoviště předvěsti', {
                'station': 'Vjezdové, Cestové, Odjezdové',
                'block_or_protection': 'Oddílové, Krycí',
                'no': 'Nemá',
                'yes': 'Neznámá',
            }).attachTo('predvest_type'),

            templates.SignalDeactivated()
        ];

        const back = thenRenderView(views.JinaSvetelna);

        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.OpakovaciPredvest] = () => {
        const title = 'Opakovací předvěst';

        const inputs = [
            ...templates.LightSignalPositioning(),

            uiMultiSelect('Základní návěsti',
                {
                    [SignalState.OpakovaniVolno]: 'Opakování volno',
                    [SignalState.OpakovaniVystraha]: 'Opakování výstraha',
                }
            ).attachTo('states'),

            uiMultiSelect('Omezení rychlosti',
                (() => {
                    const options = {};
                    for (let i = 40; i <= 160; i += 20) {
                        options[`CZ-D1:opakovani_${i}`] = `Opakování ${i}`;
                    }
                    return options;
                })()
            ).attachTo('distantSpeeds'),

            templates.SignalDeactivated()
        ];

        const back = thenRenderView(views.JinaSvetelna);

        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.TabulkaSKrizem] = () => {
        const title = 'Tabulka s křížem';
        const inputs = templates.SpeedSignalPositioning();
        const back = thenRenderView(views.CedulkyApod);
        return { title, inputs, back };
    };


    views.forNavestidlo[Navestidlo.NejakeSeradovaci] = views.default;

    views.forNavestidlo[Navestidlo.Seradovaci] = () => {
        const title = 'Seřaďovací návěstidlo';

        const inputs = [
            ...templates.LightSignalPositioning(),

            uiMultiSelect('Základní návěsti',
                {
                    [SignalState.PosunDovolen]: 'Posun dovolen',
                    [SignalState.PosunZakazan]: 'Posun zakázán'
                }
            ).attachTo('states'),
        ];

        const back = thenRenderFor(Navestidlo.NejakeNavestidlo);

        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.Vyckavaci] = () => {
        const title = 'Vyčkávací návěstidlo';
        const inputs = [
            ...templates.LeftRightOnlySignalPositioning(),

            uiSelect('Varianta', {
                [SignalForm.Sign]: 'Neproměnné',
                [SignalForm.Light]: 'Světelné',
            }).attachTo('form'),
        ];
        const back = thenRenderView(state.form === SignalForm.Sign ? views.CedulkyApod : views.JinaSvetelna);
        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.Oznacnik] = () => {
        const title = 'Označník';
        const inputs = templates.SpeedSignalPositioning();
        const back = thenRenderView(views.CedulkyApod);
        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.PosunZakazan] = () => {
        const title = 'Posun zakázán';
        const inputs = templates.AnywhereSignalPositioning();
        const back = thenRenderView(views.CedulkyApod);
        return { title, inputs, back };
    };


    views.forNavestidlo[Navestidlo.NejakyRychlostnik] = () => {
        const title = 'Nějaký rychlostník';

        const shortcuts = {
            'Rychlostník N': thenChangeState({
                navestidlo: Navestidlo.RychlostnikN,
            }),
            'Horní rychlostník N': thenChangeState({
                navestidlo: Navestidlo.HorniRychlostnikN,
            }),
            'Rychlostník N s pruhy': thenChangeState({
                navestidlo: Navestidlo.RychlostnikNSPruhy,
            }),
            'Rychlostník NS': thenChangeState({
                navestidlo: Navestidlo.RychlostnikNS,
            }),
            'Rychlostník R': thenChangeState({
                navestidlo: Navestidlo.RychlostnikR,
            }),
        };

        const inputs = [
            ...templates.SpeedSignalPositioning(),
            templates.SpeedsOfRychlostnik(),
            uiDefaultCheck('Tabulka lokomotivy').attachTo('immediate'),
        ];

        const back = thenRenderFor(Navestidlo.NejakeNavestidlo);

        return { title, shortcuts, inputs, back };
    };

    views.forNavestidlo[Navestidlo.RychlostnikN] = () => {
        const title = 'Rychlostník N';

        const inputs = [
            ...templates.SpeedSignalPositioning(),
            templates.SpeedsOfRychlostnik(),
            uiDefaultCheck('Tabulka lokomotivy').attachTo('immediate'),
        ];

        const back = thenRenderFor(Navestidlo.NejakyRychlostnik);

        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.HorniRychlostnikN] = () => {
        const title = 'Horní rychlostník N';

        const inputs = [
            ...templates.SpeedSignalPositioning(),
            templates.SpeedsOfRychlostnik(),
            uiDefaultCheck('Tabulka lokomotivy').attachTo('immediate'),
        ];

        const back = thenRenderFor(Navestidlo.NejakyRychlostnik);

        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.RychlostnikNSPruhy] = () => {
        const title = 'Rychlostník N s pruhy';

        const inputs = [
            ...templates.SpeedSignalPositioning(),
            templates.SpeedsOfRychlostnik(),
            uiDefaultCheck('Tabulka lokomotivy').attachTo('immediate'),
        ];

        const back = thenRenderFor(Navestidlo.NejakyRychlostnik);

        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.RychlostnikNS] = () => {
        const title = 'Rychlostník NS';

        const inputs = [
            ...templates.SpeedSignalPositioning(),
            templates.SpeedsOfRychlostnik(true),
            uiDefaultCheck('Tabulka lokomotivy').attachTo('immediate'),
        ];

        const back = thenRenderFor(Navestidlo.NejakyRychlostnik);

        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.RychlostnikR] = () => {
        const title = 'Rychlostník R';

        const inputs = [
            ...templates.SpeedSignalPositioning(),
            templates.SpeedsOfRychlostnik(),
            uiDefaultCheck('Tabulka lokomotivy').attachTo('immediate'),
        ];

        const back = thenRenderFor(Navestidlo.NejakyRychlostnik);

        return { title, inputs, back };
    };


    views.forNavestidlo[Navestidlo.NejakyPredvestnik] = () => {
        const title = 'Nějaký předvěstník';

        const shortcuts = {
            'Předvěstník N': thenChangeState({
                navestidlo: Navestidlo.PredvestnikN,
            }),
            'Horní předvěstník N': thenChangeState({
                navestidlo: Navestidlo.HorniPredvestnikN,
            }),
            'Předvěstník NS': thenChangeState({
                navestidlo: Navestidlo.PredvestnikNS,
            }),
            'Předvěstník R': thenChangeState({
                navestidlo: Navestidlo.PredvestnikR,
            }),
        };

        const inputs = [
            ...templates.SpeedSignalPositioning(),
            templates.SpeedsOfPredvestnik(),
            uiDefaultCheck('Zkrácená vzdálenost').attachTo('shortened'),
        ];

        const back = thenRenderFor(Navestidlo.NejakeNavestidlo);

        return { title, shortcuts, inputs, back };
    };

    views.forNavestidlo[Navestidlo.PredvestnikN] = () => {
        const title = 'Předvěstník N';

        const inputs = [
            ...templates.SpeedSignalPositioning(),
            templates.SpeedsOfPredvestnik(),
            uiDefaultCheck('Zkrácená vzdálenost').attachTo('shortened'),
        ];

        const back = thenRenderFor(Navestidlo.NejakyPredvestnik);

        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.HorniPredvestnikN] = () => {
        const title = 'Horní předvěstník N';

        const inputs = [
            ...templates.SpeedSignalPositioning(),
            templates.SpeedsOfPredvestnik(),
            uiDefaultCheck('Zkrácená vzdálenost').attachTo('shortened'),
        ];

        const back = thenRenderFor(Navestidlo.NejakyPredvestnik);

        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.PredvestnikNS] = () => {
        const title = 'Předvěstník NS';

        const inputs = [
            ...templates.SpeedSignalPositioning(),
            templates.SpeedsOfPredvestnik(true),
            uiDefaultCheck('Zkrácená vzdálenost').attachTo('shortened'),
        ];

        const back = thenRenderFor(Navestidlo.NejakyPredvestnik);

        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.PredvestnikR] = () => {
        const title = 'Předvěstník R';

        const inputs = [
            ...templates.SpeedSignalPositioning(),
            templates.SpeedsOfPredvestnik(),
            uiDefaultCheck('Zkrácená vzdálenost').attachTo('shortened'),
        ];

        const back = thenRenderFor(Navestidlo.NejakyPredvestnik);

        return { title, inputs, back };
    };


    views.forNavestidlo[Navestidlo.Stuj] = () => {
        const title = 'Stůj';
        const inputs = templates.AnywhereSignalPositioning();
        const back = thenRenderView(views.CedulkyApod);
        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.Vystraha] = () => {
        const title = 'Výstraha';
        const inputs = templates.AnywhereSignalPositioning();
        const back = thenRenderView(views.CedulkyApod);
        return { title, inputs, back };
    };


    views.forNavestidlo[Navestidlo.NejakeZastaveni] = () => {
        const title = 'Návěsti zastávek';

        const shortcuts = {
            'Vlak se blíží k zastávce': thenChangeState({
                navestidlo: Navestidlo.VlakSeBliziKZastavce,
            }),
            'Lichoběžníková tabulka': thenChangeState({
                navestidlo: Navestidlo.LichobeznikovaTabulka,
            }),
            'Konec nástupiště': thenChangeState({
                navestidlo: Navestidlo.KonecNastupiste,
            }),
            'Místo zastavení': thenChangeState({
                navestidlo: Navestidlo.MistoZastaveni,
            }),
            'Místo zastavení Os': thenChangeState({
                navestidlo: Navestidlo.MistoZastaveniOs,
            }),
        };

        const inputs = templates.LeftRightOnlySignalPositioning();

        const back = thenRenderFor(Navestidlo.NejakeNavestidlo);

        return { title, shortcuts, inputs, back };
    };

    views.forNavestidlo[Navestidlo.LichobeznikovaTabulka] = () => {
        const title = 'Lichoběžníková tabulka';

        const inputs = [
            ...templates.SpeedSignalPositioning(),
            // TODO: add caption input
        ];

        const back = thenRenderFor(Navestidlo.NejakeZastaveni);

        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.KonecNastupiste] = () => {
        const title = 'Konec nástupiště';
        const inputs = templates.LeftRightOnlySignalPositioning();
        const back = thenRenderFor(Navestidlo.NejakeZastaveni);
        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.MistoZastaveni] = () => {
        const title = 'Místo zastavení';
        const inputs = templates.LeftRightOnlySignalPositioning();
        const back = thenRenderFor(Navestidlo.NejakeZastaveni);
        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.MistoZastaveniOs] = () => {
        const title = 'Místo zastavení Os';
        const inputs = templates.LeftRightOnlySignalPositioning();
        const back = thenRenderFor(Navestidlo.NejakeZastaveni);
        return { title, inputs, back };
    };


    views.forNavestidlo[Navestidlo.NejakyRadiovnik] = () => {
        const title = 'Nějaký rychlostník';

        const shortcuts = {
            'Předvěst GSM-R': thenChangeState({
                navestidlo: Navestidlo.PredvestGsmRSite,
            }),
            'Začátek GSM-R': thenChangeState({
                navestidlo: Navestidlo.ZacatekGsmRSite,
            }),
            'Konec GSM-R': thenChangeState({
                navestidlo: Navestidlo.KonecGsmRSite,
            }),
            'Začátek analogu': thenChangeState({
                navestidlo: Navestidlo.ZacatekAnalogoveSite,
            }),
            'Konec analogu': thenChangeState({
                navestidlo: Navestidlo.KonecAnalogoveSite,
            }),
        };

        const inputs = [
            ...templates.SpeedSignalPositioning(),
            templates.SpeedsOfRychlostnik(),
        ];

        const back = thenRenderFor(Navestidlo.NejakeNavestidlo);

        return { title, shortcuts, inputs, back };
    };

    views.forNavestidlo[Navestidlo.PredvestGsmRSite] = () => {
        const title = 'Předvěst GSM-R sítě';
        const inputs = templates.LeftRightOnlySignalPositioning();
        const back = thenRenderFor(Navestidlo.NejakyRadiovnik);
        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.ZacatekGsmRSite] = () => {
        const title = 'Začátek GSM-R sítě';
        const inputs = templates.LeftRightOnlySignalPositioning();
        const back = thenRenderFor(Navestidlo.NejakyRadiovnik);
        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.KonecGsmRSite] = () => {
        const title = 'Konec GSM-R sítě';
        const inputs = templates.LeftRightOnlySignalPositioning();
        const back = thenRenderFor(Navestidlo.NejakyRadiovnik);
        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.ZacatekAnalogoveSite] = () => {
        const title = 'Začátek analogové sítě';

        const inputs = [
            ...templates.LeftRightOnlySignalPositioning(),
            // TODO: add frequency input
        ];

        const back = thenRenderFor(Navestidlo.NejakyRadiovnik);

        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.KonecAnalogoveSite] = () => {
        const title = 'Konec analogové sítě';
        const inputs = templates.LeftRightOnlySignalPositioning();
        const back = thenRenderFor(Navestidlo.NejakyRadiovnik);
        return { title, inputs, back };
    };


    views.forNavestidlo[Navestidlo.Prejezdnik] = () => {
        const title = 'Přejezdník';

        const inputs = [
            ...templates.LeftRightOnlySignalPositioning(),
            templates.SignalHeight_LightSignals(),

            // TODO: add caption input

            uiSelect('Varianta', {
                [SignalForm.Sign]: 'Neproměnné',
                [SignalForm.Light]: 'Světelné',
            }).attachTo('form'),

            uiDefaultCheck('Opakovací').attachTo('repeated'),
        ];
        const back = thenRenderView(state.form === SignalForm.Sign ? views.CedulkyApod : views.JinaSvetelna);
        return { title, inputs, back };
    };


    views.forNavestidlo[Navestidlo.VlakSeBliziKZastavce] = () => {
        const title = 'Vlak se blíží k zastávce';
        const inputs = [
            ...templates.SpeedSignalPositioning(),
            uiDefaultCheck('Zkrácená vzdálenost').attachTo('shortened'),
        ];
        const back = thenRenderFor(Navestidlo.NejakeZastaveni);
        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.NavestidloSloucenoSPredvesti] = () => {
        const title = 'Návěstidlo sloučeno s předvěstí';
        const inputs = templates.SpeedSignalPositioning();
        const back = thenRenderView(views.CedulkyApod);
        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.NavestidloSamovratneVyhybky] = () => {
        const title = 'Návěstidlo samovratné výhybky';
        const inputs = [
            ...templates.LeftRightOnlySignalPositioning(),
            templates.SignalHeight_LightSignals(),
            uiMultiSelect('Návěsti',
                {
                    [SignalState.Off]: 'Návěstidlo nesvítí',
                    [SignalState.JizdaZajistena]: 'Jízda zajištěna',
                    [SignalState.JizdaNezajistena]: 'Jízda nezajištěna'
                }
            ).attachTo('states'),
        ];
        const back = thenRenderView(views.JinaSvetelna);
        return { title, inputs, back };
    };

    views.forNavestidlo[Navestidlo.Piskejte] = () => {
        const title = 'Pískejte';
        const inputs = templates.LeftRightOnlySignalPositioning();
        const back = thenRenderView(views.CedulkyApod);
        return { title, inputs, back };
    };


    ormczSignal.tags = function (newTags) {
        loadTags(newTags);
        render(views.forNavestidlo[state.navestidlo]);
    };

    return utilRebind(ormczSignal, dispatch, 'on');
}

uiFieldOrmczSignal.supportsMultiselection = false;
