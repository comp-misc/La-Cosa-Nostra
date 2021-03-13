var logger = process.logger;

var lcn = require("../../../source/lcn.js");
var auxils = lcn.auxils;

module.exports = function (playing_config) {

  if (playing_config.roles) {
    logger.log(2, "[Random] Not running setup randomiser as roles have been defined.");

    var override = {flavour: "random"};
    return lcn.auxils.objectOverride(playing_config, override);
  };

  var number_of_town = 10;
  var number_of_mafias = 3;
  var number_of_third_parties = 1; 

  // mafia roles

  m_deflector = ["mafia_deflector", "mafia_1_shot_deflector", "mafia_2_shot_deflector", "mafia_even_night_deflector", "mafia_odd_night_deflector", "mafia_nonconsecutive_deflector"];
  m_doctor = ["mafia_doctor", "mafia_1_shot_doctor", "mafia_2_shot_doctor", "mafia_even_night_doctor", "mafia_odd_night_doctor", "mafia_nonconsecutive_doctor"];
  m_jailkeeper = ["mafia_jailkeeper", "mafia_1_shot_jailkeeper", "mafia_2_shot_jailkeeper", "mafia_even_night_jailkeeper", "mafia_odd_night_jailkeeper", "mafia_nonconsecutive_jailkeeper"];
  m_janitor = ["mafia_janitor", "mafia_1_shot_janitor", "mafia_2_shot_janitor", "mafia_even_night_janitor", "mafia_odd_night_janitor", "mafia_nonconsecutive_janitor"];
  m_kidnapper = ["mafia_kidnapper", "mafia_1_shot_kidnapper", "mafia_2_shot_kidnapper", "mafia_even_night_kidnapper", "mafia_odd_night_kidnapper", "mafia_nonconsecutive_kidnapper"];
  m_lawyer = ["mafia_lawyer", "mafia_1_shot_lawyer", "mafia_2_shot_lawyer", "mafia_even_night_lawyer", "mafia_odd_night_lawyer", "mafia_nonconsecutive_lawyer"];
  m_messenger = ["mafia_messenger", "mafia_1_shot_messenger", "mafia_2_shot_messenger", "mafia_even_night_messenger", "mafia_odd_night_messenger", "mafia_nonconsecutive_messenger"];
  m_neapolitan = ["mafia_neapolitan", "mafia_1_shot_neapolitan", "mafia_2_shot_neapolitan", "mafia_even_night_neapolitan", "mafia_odd_night_neapolitan", "mafia_nonconsecutive_neapolitan"];
  m_poisoner = ["mafia_poisoner", "mafia_1_shot_poisoner", "mafia_2_shot_poisoner", "mafia_even_night_poisoner", "mafia_odd_night_poisoner", "mafia_nonconsecutive_poisoner"];
  m_role_cop = ["mafia_role_cop", "mafia_1_shot_role_cop", "mafia_2_shot_role_cop", "mafia_even_night_role_cop", "mafia_odd_night_role_cop", "mafia_nonconsecutive_role_cop"];
  m_roleblocker = ["mafia_roleblocker", "mafia_1_shot_roleblocker", "mafia_2_shot_roleblocker", "mafia_even_night_roleblocker", "mafia_odd_night_roleblocker", "mafia_nonconsecutive_roleblocker"];
  m_strongman = ["mafia_strongman", "mafia_1_shot_strongman", "mafia_2_shot_strongman", "mafia_even_night_strongman", "mafia_odd_night_strongman", "mafia_nonconsecutive_strongman"];
  m_tracker = ["mafia_tracker", "mafia_1_shot_tracker", "mafia_2_shot_tracker", "mafia_even_night_tracker", "mafia_odd_night_tracker", "mafia_nonconsecutive_tracker"];
  m_vote_influencer = ["mafia_vote_influencer", "mafia_1_shot_vote_influencer", "mafia_2_shot_vote_influencer", "mafia_even_night_vote_influencer", "mafia_odd_night_vote_influencer", "mafia_nonconsecutive_vote_influencer"];
  m_watcher = ["mafia_watcher", "mafia_1_shot_watcher", "mafia_2_shot_watcher", "mafia_even_night_watcher", "mafia_odd_night_watcher", "mafia_nonconsecutive_watcher"];

  mafia_roles = [m_deflector, m_doctor, m_jailkeeper, m_janitor, m_kidnapper, m_lawyer, m_messenger, m_neapolitan, m_poisoner, m_role_cop, m_roleblocker, m_strongman, m_tracker, m_vote_influencer, m_watcher, ["mafia_ascetic"], ["mafia_bulletproof"], ["mafia_godfather"], ["mafia_goon"], ["mafia_neighbour"], ["mafia_pyromaniac"], ["mafia_traitor"]];

  //town roles

  t_alignment_cop = ["town_alignment_cop", "town_1_shot_alignment_cop", "town_2_shot_alignment_cop", "town_even_night_alignment_cop", "town_odd_night_alignment_cop", "town_nonconsecutive_alignment_cop"];
  t_bodyguard = ["town_bodyguard", "town_1_shot_bodyguard", "town_2_shot_bodyguard", "town_even_night_bodyguard", "town_odd_night_bodyguard", "town_nonconsecutive_bodyguard"];
  t_commuter = ["town_1_shot_commuter", "town_2_shot_commuter", "town_even_night_commuter", "town_odd_night_commuter", "town_nonconsecutive_commuter"];
  t_dayshooter = ["town_dayshooter", "town_1_shot_dayshooter", "town_2_shot_dayshooter", "town_even_day_dayshooter", "town_odd_day_dayshooter", "town_nonconsecutive_dayshooter"];
  t_doctor = ["town_doctor", "town_1_shot_doctor", "town_2_shot_doctor", "town_even_night_doctor", "town_odd_night_doctor", "town_nonconsecutive_doctor"];
  t_firefighter = ["town_firefighter", "town_1_shot_firefighter", "town_2_shot_firefighter", "town_even_night_firefighter", "town_odd_night_firefighter", "town_nonconsecutive_firefighter"];
  t_interrogator = ["town_interrogator", "town_1_shot_interrogator", "town_2_shot_interrogator", "town_even_day_interrogator", "town_odd_day_interrogator", "town_nonconsecutive_interrogator"];
  t_jailkeeper = ["town_jailkeeper", "town_1_shot_jailkeeper", "town_2_shot_jailkeeper", "town_even_night_jailkeeper", "town_odd_night_jailkeeper", "town_nonconsecutive_jailkeeper"];
  t_kidnapper = ["town_kidnapper", "town_1_shot_kidnapper", "town_2_shot_kidnapper", "town_even_night_kidnapper", "town_odd_night_kidnapper", "town_nonconsecutive_kidnapper"];
  t_lazy_tracker = ["town_lazy_tracker", "town_1_shot_lazy_tracker", "town_2_shot_lazy_tracker", "town_even_night_lazy_tracker", "town_odd_night_lazy_tracker", "town_nonconsecutive_lazy_tracker"];
  t_lazy_watcher = ["town_lazy_watcher", "town_1_shot_lazy_watcher", "town_2_shot_lazy_watcher", "town_even_night_lazy_watcher", "town_odd_night_lazy_watcher", "town_nonconsecutive_lazy_watcher"];
  t_messenger = ["town_messenger", "town_1_shot_messenger", "town_2_shot_messenger", "town_even_night_messenger", "town_odd_night_messenger", "town_nonconsecutive_messenger"];
  t_neapolitan = ["town_neapolitan", "town_1_shot_neapolitan", "town_2_shot_neapolitan", "town_even_night_neapolitan", "town_odd_night_neapolitan", "town_nonconsecutive_neapolitan"];
  t_observer = ["town_observer", "town_1_shot_observer", "town_2_shot_observer", "town_even_night_observer", "town_odd_night_observer", "town_nonconsecutive_observer"];
  t_oracle = ["town_oracle", "town_1_shot_oracle", "town_2_shot_oracle", "town_even_night_oracle", "town_odd_night_oracle", "town_nonconsecutive_oracle"];
  t_poisoner = ["town_poisoner", "town_1_shot_poisoner", "town_2_shot_poisoner", "town_even_night_poisoner", "town_odd_night_poisoner", "town_nonconsecutive_poisoner"];
  t_role_cop = ["town_role_cop", "town_1_shot_role_cop", "town_2_shot_role_cop", "town_even_night_role_cop", "town_odd_night_role_cop", "town_nonconsecutive_role_cop"];
  t_roleblocker = ["town_roleblocker", "town_1_shot_roleblocker", "town_2_shot_roleblocker", "town_even_night_roleblocker", "town_odd_night_roleblocker", "town_nonconsecutive_roleblocker"];
  t_tracker = ["town_tracker", "town_1_shot_tracker", "town_2_shot_tracker", "town_even_night_tracker", "town_odd_night_tracker", "town_nonconsecutive_tracker"];
  t_veteran = ["town_1_shot_veteran", "town_2_shot_veteran", "town_even_night_veteran", "town_odd_night_veteran", "town_nonconsecutive_veteran"];
  t_vigilante = ["town_vigilante", "town_1_shot_vigilante", "town_2_shot_vigilante", "town_even_night_vigilante", "town_odd_night_vigilante", "town_nonconsecutive_vigilante"];
  t_vote_influencer = ["town_vote_influencer", "town_1_shot_vote_influencer", "town_2_shot_vote_influencer", "town_even_night_vote_influencer", "town_odd_night_vote_influencer", "town_nonconsecutive_vote_influencer"];
  t_watcher = ["town_watcher", "town_1_shot_watcher", "town_2_shot_watcher", "town_even_night_watcher", "town_odd_night_watcher", "town_nonconsecutive_watcher"];

  town_roles = [t_alignment_cop, t_bodyguard, t_commuter, t_dayshooter, t_doctor, t_firefighter, t_interrogator, t_jailkeeper, t_kidnapper, t_lazy_tracker, t_lazy_watcher, t_messenger, t_neapolitan, t_observer, t_oracle, t_poisoner, t_role_cop, t_roleblocker, t_tracker, t_veteran, t_vigilante, t_vote_influencer, t_watcher, ["town_ascetic"], ["town_bomb"], ["town_bulletproof"], ["town_compulsive_visitor"], ["town_cupid"], ["town_governor"], ["town_innocent_child"], ["town_lover"], ["town_mayor"], ["town_miller"], ["town_neighbour"], ["town_vanilla_townie"]]

  //third party roles

  third_party_roles = ["3p_serial_killer_im_bp", "3p_arsonist_im_bp", "3p_fool", "3p_jester","3p_survivor"];

  var third_parties = [];
  var mafias = [];
  var town = [];

  var neighbours = 0;
  var lovers = 0;

  //assigning third party roles

  for (var i = 0; i < number_of_third_parties; i++) {
      third_parties = third_parties.concat(third_party_roles[Math.ceil((Math.floor(Math.random() * third_party_roles.length)))])
      };

  //assigning mafia roles

  for (var i = 0; i < number_of_mafias ; i++) {
      var role = Math.ceil((Math.floor(Math.random() * mafia_roles.length)));
      var type = Math.ceil((Math.floor(Math.random() * mafia_roles[role].length)));
      mafias = mafias.concat(mafia_roles[role][type]);

      if (mafia_roles[role][type]=="mafia_neighbour") {
          neighbours++;
          };
      };

  //assigning town roles

  for (var i = 0; i < number_of_town; i++) {
      var role = Math.ceil((Math.floor(Math.random() * town_roles.length)));
      var type = Math.ceil((Math.floor(Math.random() * town_roles[role].length)));
      
      town = town.concat(town_roles[role][type]);

      if (town_roles[role][type]=="town_neighbour") {
          neighbours++;
          };

      if (town_roles[role][type]=="town_lover") {
          lovers++;
          };
      };

  //adding a neighbour if there's only 1

  if (neighbours == 1) {

      number = Math.random(number_of_mafias/mafia_roles.length + number_of_town/town_roles.length)

      if (number <= number_of_mafias/mafia_roles.length) {
          if (!mafias[0] == "mafia_neighbour") {
              mafias[0] = "mafia_neighbour"
          } else {
              mafias[1] = "mafia_neighbour"
          };
      } else {
          for (var i = 0; i < number_of_town; i++) {
              if (!(town[i] == "town_neighbour") && !(town[i] == "town_lover")) {
                  town[i] = "town_neighbour"
                  break;
              };
          };
      };
  };

  //adding a lover if there's only 1

  if (lovers == 1) {

      for (var i = 0; i < number_of_town; i++) {

          if (!(town[i] == "town_neighbour") && !(town[i] == "town_lover")) {
              town[i] = "town_lover"
              break;
          };
      };
  };

  var setup = town.concat(mafias.concat(third_parties));

  //shuffles setup list

  for (var c = setup.length - 1; c > 0; c--) {
      var b = Math.floor(Math.random() * (c + 1));
      var a = setup[c];
      setup[c] = setup[b];
      setup[b] = a;
  };

  logger.log(2, "[Random] Running setup: {%s}", auxils.pettyFormat(setup));

  var override = {roles: setup, flavour: "random"};

  return lcn.auxils.objectOverride(playing_config, override);

};
