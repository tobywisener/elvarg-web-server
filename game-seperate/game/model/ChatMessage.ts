export class ChatMessage
{
    // *
    // 	 * The color of the message.
    public colour:number;
    // *
    // 	 * The effects of the message.
    public effects:number;
    // *
    // 	 * The actual text of the message.
    public text:number[];
    // *
    //     * The Message constructor.
    //     *
    //     * @param colour  The color the message will have, done through color(#):
    //     * @param effects The effect the message will have, done through effect(#):
    //     * @param text    The actual message it will have.
    constructor(colour:number, effects:number, text:number[])
    {
        this.colour = colour;
        this.effects = effects;
        this.text = text;
    }
    public getColour() {
        return this.colour;
    }
    public getEffects() {
        return this.effects;
    }
    public getText() {
        return this.text;
    }
}