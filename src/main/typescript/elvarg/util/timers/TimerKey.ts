import { Misc } from "../Misc";

export class TimerKey {
	public static readonly FOOD = new TimerKey();
	public static readonly KARAMBWAN = new TimerKey();
	public static readonly POTION = new TimerKey();
	public static readonly COMBAT_ATTACK= new TimerKey();
	public static readonly FREEZE = new TimerKey();
	public static readonly FREEZE_IMMUNITY = new TimerKey(); 
	public static readonly STUN =  new TimerKey();
	public static readonly ATTACK_IMMUNITY = new TimerKey();
	public static readonly CASTLEWARS_TAKE_ITEM = new TimerKey();
	public static readonly STEPPING_OUT = new TimerKey();
	public static readonly BOT_WAIT_FOR_PLAYERS = new TimerKey(Misc.getTicks(180 /* 3 minutes */));

	private ticks: number;


	constructor(ticks?: number) {
		this.ticks = ticks;
	}

	public getTicks(): number {
		return this.ticks;
	}
}




