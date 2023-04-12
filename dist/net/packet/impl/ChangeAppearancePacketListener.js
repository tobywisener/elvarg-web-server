"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeAppearancePacketListener = void 0;
var Appearance_1 = require("../../../game/model/Appearance");
var Flag_1 = require("../../../game/model/Flag");
var ChangeAppearancePacketListener = exports.ChangeAppearancePacketListener = /** @class */ (function () {
    function ChangeAppearancePacketListener() {
    }
    ChangeAppearancePacketListener.prototype.execute = function (player, packet) {
        try {
            var gender = packet.readByte();
            if (gender !== 0 && gender !== 1) {
                return;
            }
            var apperances = new Array(ChangeAppearancePacketListener.MALE_VALUES.length);
            var colors = new Array(ChangeAppearancePacketListener.ALLOWED_COLORS.length);
            for (var i = 0; i < apperances.length; i++) {
                var value = packet.readByte();
                if (value < (gender === 0 ? ChangeAppearancePacketListener.MALE_VALUES[i][0] : ChangeAppearancePacketListener.FEMALE_VALUES[i][0]) || value > (gender === 0 ? ChangeAppearancePacketListener.MALE_VALUES[i][1] : ChangeAppearancePacketListener.FEMALE_VALUES[i][1]))
                    value = (gender === 0 ? ChangeAppearancePacketListener.MALE_VALUES[i][0] : ChangeAppearancePacketListener.FEMALE_VALUES[i][0]);
                apperances[i] = value;
            }
            for (var i = 0; i < colors.length; i++) {
                var value = packet.readByte();
                if (value < ChangeAppearancePacketListener.ALLOWED_COLORS[i][0] || value > ChangeAppearancePacketListener.ALLOWED_COLORS[i][1])
                    value = ChangeAppearancePacketListener.ALLOWED_COLORS[i][0];
                colors[i] = value;
            }
            if (player.getAppearance().getCanChangeAppearance() && player.getInterfaceId() > 0) {
                //Appearance looks
                player.getAppearance().setLook(Appearance_1.Appearance.GENDER, gender);
                player.getAppearance().setLook(Appearance_1.Appearance.HEAD, apperances[0]);
                player.getAppearance().setLook(Appearance_1.Appearance.CHEST, apperances[2]);
                player.getAppearance().setLook(Appearance_1.Appearance.ARMS, apperances[3]);
                player.getAppearance().setLook(Appearance_1.Appearance.HANDS, apperances[4]);
                player.getAppearance().setLook(Appearance_1.Appearance.LEGS, apperances[5]);
                player.getAppearance().setLook(Appearance_1.Appearance.FEET, apperances[6]);
                player.getAppearance().setLook(Appearance_1.Appearance.BEARD, apperances[1]);
                //Colors
                player.getAppearance().setLook(Appearance_1.Appearance.HAIR_COLOUR, colors[0]);
                player.getAppearance().setLook(Appearance_1.Appearance.TORSO_COLOUR, colors[1]);
                player.getAppearance().setLook(Appearance_1.Appearance.LEG_COLOUR, colors[2]);
                player.getAppearance().setLook(Appearance_1.Appearance.FEET_COLOUR, colors[3]);
                player.getAppearance().setLook(Appearance_1.Appearance.SKIN_COLOUR, colors[4]);
                player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
            }
        }
        catch (e) {
            player.getAppearance().set();
            //e.printStackTrace();
        }
        player.getPacketSender().sendInterfaceRemoval();
        player.getAppearance().setCanChangeAppearance(false);
    };
    ChangeAppearancePacketListener.ALLOWED_COLORS = [
        [0, 11],
        [0, 15],
        [0, 15],
        [0, 5],
        [0, 7] // skin color
    ];
    ChangeAppearancePacketListener.FEMALE_VALUES = [
        [45, 54],
        [-1, -1],
        [56, 60],
        [61, 65],
        [67, 68],
        [70, 77],
        [79, 80], // feet
    ];
    ChangeAppearancePacketListener.MALE_VALUES = [
        [0, 8],
        [10, 17],
        [18, 25],
        [26, 31],
        [33, 34],
        [36, 40],
        [42, 43], // feet
    ];
    return ChangeAppearancePacketListener;
}());
//# sourceMappingURL=ChangeAppearancePacketListener.js.map