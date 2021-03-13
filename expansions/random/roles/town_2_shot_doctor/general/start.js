// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("town_2_shot_doctor/roleblocked", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.misc.doctor_protects_left = 2;
};
