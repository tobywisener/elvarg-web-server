import { GameConstants } from "../GameConstants";
import { Buffer } from "../collision/Buffer";
import { FileUtil } from "../../util/FileUtil"
import { ObjectIdentifiers } from "../../util/ObjectIdentifiers";
import fs from "fs-extra";

export class ObjectDefinition extends ObjectIdentifiers {
    static OBELISK_IDS = [14829, 14830, 14827, 14828, 14826, 14831];
    static lowMemory: boolean;
    static stream: Buffer;
    static streamIndices: number[];
    static cacheIndex: number;
    static cache: ObjectDefinition[];
    static totalObjects: number;
    static obstructsGround: boolean;
    static ambientLighting: number;
    static translateX: number;
    name: string;
    static scaleZ: number;
    static lightDiffusion: number;
    static objectSizeX: number;
    static translateY: number;
    static minimapFunction: number;
    static originalModelColors: number[];
    static scaleX: number;
    static varp: number;
    static inverted: boolean;
    id: number;
    static impenetrable: boolean;
    static mapscene: number;
    static childrenIDs: number[];
    static supportItems: number;
    static objectSizeY: number;
    static contouredGround: boolean;
    static occludes: boolean;
    static removeClipping: boolean;
    static solid: boolean;
    static blockingMask: number;
    static delayShading: boolean;
    static scaleY: number;
    static modelIds: number[];
    static varbit: number;
    static decorDisplacement: number;
    static modelTypes: number[];
    description: string;
    static isInteractive: boolean;
    static castsShadow: boolean;
    static animation: number;
    static translateZ: number;
    static modifiedModelColors: number[];
    static interactions: string[];
    static originalModelTexture: number[];
    static modifiedModelTexture: number[];
    clipType: number = 2;

    constructor() {
        super();
        this.id = -1;
    }

    static dumpNames() {
        let writer = fs.writeFile("./Cache/object_names.txt");
        for (let i = 0; i < ObjectDefinition.totalObjects; i++) {
            let def = ObjectDefinition.forId(i);
            let name = def == null ? "null" : def.name;
            writer.write("ID: " + i + ", name: " + name + "");
            writer.newLine();
        }
        writer.close();
    }
    isClippedDecoration(): boolean {
        return ObjectDefinition.isInteractive || this.clipType == 1 || ObjectDefinition.obstructsGround;
    }

    static forId(id: number): ObjectDefinition {
        if (id > ObjectDefinition.streamIndices.length)
            id = ObjectDefinition.streamIndices.length - 1;
        for (let index = 0; index < 20; index++)
            if (ObjectDefinition.cache[index].id == id)
                return ObjectDefinition.cache[index];

        if (id == 25913)
            id = 15552;

        if (id == 25916 || id == 25926)
            id = 15553;

        if (id == 25917)
            id = 15554;

        ObjectDefinition.cacheIndex = (ObjectDefinition.cacheIndex + 1) % 20;
        let objectDef = ObjectDefinition.cache[ObjectDefinition.cacheIndex];
        ObjectDefinition.stream.offset = ObjectDefinition.streamIndices[id];
        objectDef.id = id;
        objectDef.reset();
        objectDef.readValues(ObjectDefinition.stream);
        if (objectDef.id > 14500) {
            if (ObjectDefinition.delayShading) {
                ObjectDefinition.delayShading = false;
            }
        }

        for (let obelisk of ObjectDefinition.OBELISK_IDS) {
            if (id == obelisk) {
                ObjectDefinition.interactions = ["Activate", null, null, null, null];
            }
        }

        if (id == 29241) {
            ObjectDefinition.interactions = new Array(5);
            ObjectDefinition.interactions[0] = "Restore-stats";
        }
        if (id == 4150) {
            objectDef.name = "Bank portal";
        } else if (id == 4151) {
            objectDef.name = "Ditch portal";
        }

        if (id == 26756) {
            objectDef.name = "Information";
            ObjectDefinition.interactions = null;
        }

        if (id == 6552) {
            ObjectDefinition.interactions = ["Venerate", "Switch-normal", "Switch-ancient", "Switch-lunar", null];
            objectDef.name = "Magical altar";
        }

        if (id == 6552) {
            ObjectDefinition.interactions = ["Toggle-spells", null, null, null, null];
            objectDef.name = "Ancient altar";
        }

        if (id == 14911) {
            ObjectDefinition.interactions = ["Toggle-spells", null, null, null, null];
            objectDef.name = "Lunar altar";
        }
        if (id == 2164) {
            ObjectDefinition.isInteractive = true;
            ObjectDefinition.interactions = ["Fix", null, null, null, null];
            objectDef.name = "Trawler Net";
        }
        if (id == 1293) {
            ObjectDefinition.isInteractive = true;
            ObjectDefinition.interactions = ["Teleport", null, null, null, null];
            objectDef.name = "Spirit Tree";
        }

        if (id == 2452) {
            ObjectDefinition.isInteractive = true;
            ObjectDefinition.interactions = ["Go Through", null, null, null, null];
            objectDef.name = "Passage";
        }
        switch (id) {
            case 10638:
                ObjectDefinition.isInteractive = true;
                return objectDef;
        }

        return objectDef;
    }

    static init() {
        try {
            let dat = FileUtil.readFile(GameConstants.CLIPPING_DIRECTORY + "loc.dat");
            let idx = FileUtil.readFile(GameConstants.CLIPPING_DIRECTORY + "loc.idx");

            ObjectDefinition.stream = new Buffer(dat);
            let idxBuffer525 = new Buffer(idx);

            let totalObjects525 = idxBuffer525.readUnsignedWord();
            ObjectDefinition.streamIndices = new Array(totalObjects525);
            let i = 2;
            for (let j = 0; j < totalObjects525; j++) {
                ObjectDefinition.streamIndices[j] = i;
                i += idxBuffer525.readUnsignedWord();
            }

            ObjectDefinition.cache = new Array<ObjectDefinition>(20);
            for (let k = 0; k < 20; k++) {
                ObjectDefinition.cache[k] = new ObjectDefinition();
            }

        } catch (e) {
            console.log(e);
        }
    }

    public reset() {
        ObjectDefinition.modelIds = null;
        ObjectDefinition.modelTypes = null;
        this.name = null;
        this.description = null;
        ObjectDefinition.modifiedModelColors = null;
        ObjectDefinition.originalModelColors = null;
        ObjectDefinition.modifiedModelTexture = null;
        ObjectDefinition.originalModelTexture = null;
        ObjectDefinition.objectSizeX = 1;
        ObjectDefinition.objectSizeY = 1;
        ObjectDefinition.solid = true;
        ObjectDefinition.impenetrable = true;
        ObjectDefinition.isInteractive = false;
        ObjectDefinition.contouredGround = false;
        ObjectDefinition.delayShading = false;
        ObjectDefinition.occludes = false;
        ObjectDefinition.animation = -1;
        ObjectDefinition.decorDisplacement = 16;
        ObjectDefinition.ambientLighting = 0;
        ObjectDefinition.lightDiffusion = 0;
        ObjectDefinition.interactions = null;
        ObjectDefinition.minimapFunction = -1;
        ObjectDefinition.mapscene = -1;
        ObjectDefinition.inverted = false;
        ObjectDefinition.castsShadow = true;
        ObjectDefinition.scaleX = 128;
        ObjectDefinition.scaleY = 128;
        ObjectDefinition.scaleZ = 128;
        ObjectDefinition.blockingMask = 0;
        ObjectDefinition.translateX = 0;
        ObjectDefinition.translateY = 0;
        ObjectDefinition.translateZ = 0;
        ObjectDefinition.obstructsGround = false;
        ObjectDefinition.removeClipping = false;
        ObjectDefinition.supportItems = -1;
        ObjectDefinition.varbit = -1;
        ObjectDefinition.varp = -1;
        ObjectDefinition.childrenIDs = null;
    }

    readValues(buffer: Buffer) {
        while (true) {
            let opcode: number = buffer.readUnsignedByte();

            if (opcode === 0) {
                break;
            } else if (opcode === 1) {
                let len: number = buffer.readUnsignedByte();
                if (len > 0) {
                    if (ObjectDefinition.modelIds === null) {
                        ObjectDefinition.modelTypes = new Array<number>(len);
                        ObjectDefinition.modelIds = new Array<number>(len);

                        for (let i: number = 0; i < len; i++) {
                            ObjectDefinition.modelIds[i] = buffer.readUShort();
                            ObjectDefinition.modelTypes[i] = buffer.readUnsignedByte();
                        }
                    } else {
                        buffer.offset += len * 3;
                    }
                }
            } else if (opcode === 2) {
                this.name = buffer.readString();
            } else if (opcode === 5) {
                let len: number = buffer.readUnsignedByte();
                if (len > 0) {
                    if (ObjectDefinition.modelIds === null) {
                        ObjectDefinition.modelTypes = null;
                        ObjectDefinition.modelIds = new Array<number>(len);
                        for (let i: number = 0; i < len; i++) {
                            ObjectDefinition.modelIds[i] = buffer.readUShort();
                        }
                    } else {
                        buffer.offset += len * 2;
                    }
                }
            } else if (opcode === 14) {
                ObjectDefinition.objectSizeX = buffer.readUnsignedByte();
            } else if (opcode === 15) {
                ObjectDefinition.objectSizeY = buffer.readUnsignedByte();
            } else if (opcode === 17) {
                ObjectDefinition.solid = false;
            } else if (opcode === 18) {
                ObjectDefinition.impenetrable = false;
            } else if (opcode === 19) {
                ObjectDefinition.isInteractive = (buffer.readUnsignedByte() === 1);
            } else if (opcode === 21) {
                ObjectDefinition.contouredGround = true;
            } else if (opcode === 22) {
                ObjectDefinition.delayShading = true;
            } else if (opcode === 23) {
                ObjectDefinition.occludes = true;
            } else if (opcode === 24) {
                ObjectDefinition.animation = buffer.readUShort();
                if (ObjectDefinition.animation === 0xFFFF) {
                    ObjectDefinition.animation = -1;
                }
            } else if (opcode === 27) {
                //clipType = 1;
            } else if (opcode === 28) {
                ObjectDefinition.decorDisplacement = buffer.readUnsignedByte();
            } else if (opcode === 29) {
                ObjectDefinition.ambientLighting = buffer.readSignedByte();
            } else if (opcode === 39) {
                ObjectDefinition.lightDiffusion = buffer.readSignedByte() * 25;
            } else if (opcode >= 30 && opcode < 35) {
                if (ObjectDefinition.interactions === null) {
                    ObjectDefinition.interactions = new Array<string>(5);
                }
                ObjectDefinition.interactions[opcode - 30] = buffer.readString();
                if (ObjectDefinition.interactions[opcode - 30].toLowerCase() === "hidden") {
                    ObjectDefinition.interactions[opcode - 30] = null;
                }
            } else if (opcode === 40) {
                let len: number = buffer.readUnsignedByte();
                ObjectDefinition.modifiedModelColors = new Array<number>(len);
                ObjectDefinition.originalModelColors = new Array<number>(len);
                for (let i: number = 0; i < len; i++) {
                    ObjectDefinition.modifiedModelColors[i] = buffer.readUShort();
                    ObjectDefinition.originalModelColors[i] = buffer.readUShort();
                }
            } else if (opcode === 41) {
                let len: number = buffer.readUnsignedByte();
                ObjectDefinition.modifiedModelTexture = new Array<number>(len);
                ObjectDefinition.originalModelTexture = new Array<number>(len);
                for (let i: number = 0; i < len; i++) {
                    ObjectDefinition.modifiedModelTexture[i] = buffer.readUShort();
                    ObjectDefinition.originalModelTexture[i] = buffer.readUShort();
                }
            } else if (opcode === 62) {
                ObjectDefinition.inverted = true;
            } else if (opcode === 64) {
                ObjectDefinition.castsShadow = false;
            } else if (opcode === 65) {
                ObjectDefinition.scaleX = buffer.readUShort();
            } else if (opcode === 66) {
                ObjectDefinition.scaleY = buffer.readUShort();
            } else if (opcode === 67) {
                ObjectDefinition.scaleZ = buffer.readUShort();
            } else if (opcode === 68) {
                ObjectDefinition.mapscene = buffer.readUShort();
            } else if (opcode === 69) {
                ObjectDefinition.blockingMask = buffer.readUnsignedByte();
            } else if (opcode === 70) {
                ObjectDefinition.translateX = buffer.readUShort();
            } else if (opcode === 71) {
                ObjectDefinition.translateY = buffer.readUShort();
            } else if (opcode === 72) {
                ObjectDefinition.translateZ = buffer.readUShort();
            } else if (opcode === 73) {
                ObjectDefinition.obstructsGround = true;
            } else if (opcode === 74) {
                ObjectDefinition.removeClipping = true;
            } else if (opcode === 75) {
                ObjectDefinition.supportItems = buffer.readUnsignedByte();
            } else if (opcode === 78) {
                buffer.readUShort(); // ambient sound id
                buffer.readUnsignedByte();
            } else if (opcode === 79) {
                buffer.readUShort();
                buffer.readUShort();
                buffer.readUnsignedByte();
                let len: number = buffer.readUnsignedByte();

                for (let i: number = 0; i < len; i++) {
                    buffer.readUShort();
                }
            } else if (opcode === 81) {
                buffer.readUnsignedByte();
            } else if (opcode === 82) {
                ObjectDefinition.minimapFunction = buffer.readUShort();

                if (ObjectDefinition.minimapFunction === 0xFFFF) {
                    ObjectDefinition.minimapFunction = -1;
                }
            } else if (opcode === 77 || opcode === 92) {
                ObjectDefinition.varp = buffer.readUShort();

                if (ObjectDefinition.varp === 0xFFFF) {
                    ObjectDefinition.varp = -1;
                }

                ObjectDefinition.varbit = buffer.readUShort();

                if (ObjectDefinition.varbit === 0xFFFF) {
                    ObjectDefinition.varbit = -1;
                }

                let value: number = -1;

                if (opcode === 92) {
                    value = buffer.readUShort();

                    if (value === 0xFFFF) {
                        value = -1;
                    }
                }

                let len: number = buffer.readUnsignedByte();

                ObjectDefinition.childrenIDs = new Array<number>(len + 2);
                for (let i: number = 0; i <= len; ++i) {
                    ObjectDefinition.childrenIDs[i] = buffer.readUShort();
                    if (ObjectDefinition.childrenIDs[i] === 0xFFFF) {
                        ObjectDefinition.childrenIDs[i] = -1;
                    }
                }
                ObjectDefinition.childrenIDs[len + 1] = value;
            } else {
                console.log("invalid opcode: " + opcode);
            }
        }

        if (name !== null && this.name !== "null") {
            ObjectDefinition.isInteractive = ObjectDefinition.modelIds !== null && (ObjectDefinition.modelTypes === null || ObjectDefinition.modelTypes[0] === 10);
            if (ObjectDefinition.interactions !== null)
                ObjectDefinition.isInteractive = true;
        }

        if (ObjectDefinition.removeClipping) {
            ObjectDefinition.solid = false;
            ObjectDefinition.impenetrable = false;
        }

        if (ObjectDefinition.supportItems === -1) {
            ObjectDefinition.supportItems = ObjectDefinition.solid ? 1 : 0;
        }
    }

    public getName(): string {
        return this.name;
    }

    public getSizeX(): number {
        return ObjectDefinition.objectSizeX;
    }

    public getSizeY(): number {
        return ObjectDefinition.objectSizeY;
    }

    public hasActions(): boolean {
        return ObjectDefinition.isInteractive;
    }

    public getSize(): number {
        switch (this.id) {
            case ObjectDefinition.BARROWS_STAIRCASE_AHRIM:
            case ObjectDefinition.BARROWS_STAIRCASE_DHAROK:
            case ObjectDefinition.BARROWS_STAIRCASE_GUTHAN:
            case ObjectDefinition.BARROWS_STAIRCASE_KARIL:
            case ObjectDefinition.BARROWS_STAIRCASE_VERAC:
                return 2;
            case ObjectDefinition.BARROWS_STAIRCASE_TORAG:
                return 3;
        }

        return (this.getSizeX() + this.getSizeY()) - 1;
    }
}
