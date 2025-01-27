


const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  roles: {
    type: [String],
    default: [
     
     
      "umoja_wa_vijana",
      "kiongozi_umoja_wa_vijana",
      "kwaya_ya_umoja_wa_vijana",
      "kiongozi_kwaya_ya_umoja_wa_vijana",
      "kwaya_kuu",
      "kiongozi_kwaya_kuu",
      "kwaya_ya_wamama",
      "kiongozi_kwaya_ya_wamama",
      "kwaya_ya_vijana",
      "kiongozi_kwaya_ya_vijana",
      "praise_team",
      "kiongozi_praise_team",
      "kwaya_ya_uinjilisti",
      "kiongozi_kwaya_ya_uinjilsti",
      "wababa_kati",
      "kiongozi_wababa_kati",
      "umoja_wa_wanaume",
      "kiongozi_umoja_wa_wanaume",
      "baraza_la_wazee",
      "kiongozi_baraza_la_wazee",
      "umoja_wa_wanawake",
      "kiongozi_umoja_wa_wanawake",
      "wamama",
      "darasa_la_nikodemo",
      "kiongozi_darasa_la_nikodemo",
      "shule_ya_jumapili",
      'kiongozi_shule_ya_jumapili',
      "kiongozi_wamama",
      "wababa",
      "kiongozi_wababa",
      "jumuiya_kanisani",
      "jumuiya_malawi",
      "jumuiya_golani",
      "kiongozi_jumuiya_kanisani",
      "kiongozi_jumuiya_malawi",
      "kiongozi_jumuiya_golani",
    ],
  },

});

const Roles = mongoose.model('Roles', roleSchema);

module.exports = Roles;
