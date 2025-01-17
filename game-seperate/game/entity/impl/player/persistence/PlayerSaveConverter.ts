import{JacksonAttributeConverter} from '../JacksonAttributeConverter'
import {PlayerSave} from './PlayerSave'

export class PlayerSaveConverter extends JacksonAttributeConverter<PlayerSave> {
    constructor() {
        super(PlayerSave);
    }
}
