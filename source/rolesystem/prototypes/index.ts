import basicAttack from "./basicAttack"
import basicCommute from "./basicCommute"
import basicDefense from "./basicDefense"
import basicHide from "./basicHide"
import basicJail from "./basicJail"
import powerfulAttack from "./powerfulAttack"
import powerfulDefense from "./powerfulDefense"
import unstoppableAttack from "./unstoppableAttack"
import unstoppableCommute from "./unstoppableCommute"
import unstoppableDefense from "./unstoppableDefense"
import unstoppableKidnap from "./unstoppableKidnap"

export default {
	basicAttack,
	basicCommute,
	basicDefense,
	basicHide,
	basicKidnap: basicJail,
	powerfulAttack,
	powerfulDefense,
	unstoppableAttack,
	unstoppableCommute,
	unstoppableDefense,
	unstoppableKidnap,
}
