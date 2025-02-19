export class DialogueExpression{
        public static readonly HAPPY = new DialogueExpression(588);
        public static readonly CALM  = new DialogueExpression(589);
        public static readonly CALM_CONTINUED = new DialogueExpression(590);
        public static readonly DEFAULT  =new DialogueExpression(591);
        public static readonly EVIL= new DialogueExpression(592);
        public static readonly EVIL_CONTINUED = new DialogueExpression(593);
        public static readonly DELIGHTED_EVIL = new DialogueExpression(594);
        public static readonly ANNOYED  = new DialogueExpression(595);
        public static readonly DISTRESSED  = new DialogueExpression(596);
        public static readonly DISTRESSED_CONTINUED  = new DialogueExpression(597);
        public static readonly DISORIENTED_LEFT  = new DialogueExpression(600);
        public static readonly DISORIENTED_RIGHT  = new DialogueExpression(601);
        public static readonly UNINTERESTED  = new DialogueExpression(602);
        public static readonly SLEEPY  = new DialogueExpression(603);
        public static readonly PLAIN_EVIL  = new DialogueExpression(604);
        public static readonly LAUGHING  = new DialogueExpression(605);
        public static readonly LAUGHING_2  = new DialogueExpression(608);
        public static readonly LONGER_LAUGHING  = new DialogueExpression(606);
        public static readonly LONGER_LAUGHING_2  = new DialogueExpression(607);
        public static readonly EVIL_LAUGH_SHORT  = new DialogueExpression(609);
        public static readonly SLIGHTLY_SAD  = new DialogueExpression(610);
        public static readonly SAD  = new DialogueExpression(599);
        public static readonly VERY_SAD  = new DialogueExpression(611);
        public static readonly OTHER  = new DialogueExpression(612);
        public static readonly NEAR_TEARS  = new DialogueExpression(598);
        public static readonly NEAR_TEARS_2  = new DialogueExpression(613);
        public static readonly ANGRY_1  = new DialogueExpression(614);
        public static readonly ANGRY_2  = new DialogueExpression(615);
        public static readonly ANGRY_3  = new DialogueExpression(616);
        public static readonly ANGRY_4  = new DialogueExpression(617);

    private readonly expression: number;

    constructor(expression: number) {
        this.expression = expression;
    }

    public getExpression(): number {
        return this.expression;
    }

    

}