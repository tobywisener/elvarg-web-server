import { Player } from "../../Player";
import { PlayerSave } from "../PlayerSave";
import { Misc } from "../../../../../../util/Misc";
import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";
import { PasswordUtil } from "../../../../../../util/PasswordUtil";
import { FileReader } from "java.io";
import * as path from 'path';
import * as fs from 'fs';
import { GsonBuilder } from 'gson';

export class JSONFilePlayerPersistence {
  private static PATH = './data/saves/characters/';
  private static BUILDER = new JsonConvert(OperationMode.ENABLE, ValueCheckingMode.DISALLOW_NULL);

    public load(username: string): PlayerSave {
        if (!this.exists(username)) {
        return null;
        }

        const filePath: string = path.join(JSONFilePlayerPersistence.PATH, username + '.json');
        const fileContent: string = fs.readFileSync(filePath, 'utf-8');
        const file: File = new File([fileContent], username + '.json', { type: 'text/json' });

        try {
        const fileReader: FileReader = new FileReader(file);
        const jsonConverter = new JsonConvert();
        const playerSave: PlayerSave = jsonConverter.deserializeObject(fileReader, PlayerSave);
        return playerSave;
        } catch (e) {
        throw new Error(e);
        }
    }

    public save(player: Player): void {
        const save: PlayerSave = PlayerSave.fromPlayer(player);
    
        const filePath: string = path.join(JSONFilePlayerPersistence.PATH, player.getUsername() + '.json');
        this.setupDirectory(filePath);
    
        const builder = new GsonBuilder().setPrettyPrinting().create();
    
        try {
          fs.writeFileSync(filePath, builder.toJson(save));
        } catch (e) {
          throw new Error(e);
        }
      }

      public exists(username: string): boolean {
        const formattedUsername = Misc.formatPlayerName(username.toLowerCase());
        const filePath = path.join(JSONFilePlayerPersistence.PATH, `${formattedUsername}.json`);
        return fs.existsSync(filePath);
      }

    public async encryptPassword(plainPassword: string): Promise<string> {
        // TODO: Fix password encryption for JSON
        const passwordEncrypt: string = await PasswordUtil.generatePasswordHashWithSalt(plainPassword);
        return passwordEncrypt;
    }

    public checkPassword(plainPassword: string, playerSave: PlayerSave): boolean {
        // TODO: Fix password encryption for JSON
        return plainPassword === playerSave.getPasswordHashWithSalt();
    }

    private setupDirectory(filePath: string): void {
        const dirPath: string = path.dirname(filePath);
    
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
      }
}