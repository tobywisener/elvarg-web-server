"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeAppearancePacketListener = void 0;
var ChangeAppearancePacketListener = /** @class */ (function () {
    function ChangeAppearancePacketListener() {
    }
    // public execute(player: Player, packet: Packet) {
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
                if (value <
                    (gender === 0
                        ? ChangeAppearancePacketListener.MALE_VALUES[i][0]
                        : ChangeAppearancePacketListener.FEMALE_VALUES[i][0]) ||
                    value >
                        (gender === 0
                            ? ChangeAppearancePacketListener.MALE_VALUES[i][1]
                            : ChangeAppearancePacketListener.FEMALE_VALUES[i][1]))
                    value =
                        gender === 0
                            ? ChangeAppearancePacketListener.MALE_VALUES[i][0]
                            : ChangeAppearancePacketListener.FEMALE_VALUES[i][0];
                apperances[i] = value;
            }
            for (var i = 0; i < colors.length; i++) {
                var value = packet.readByte();
                if (value < ChangeAppearancePacketListener.ALLOWED_COLORS[i][0] ||
                    value > ChangeAppearancePacketListener.ALLOWED_COLORS[i][1])
                    value = ChangeAppearancePacketListener.ALLOWED_COLORS[i][0];
                colors[i] = value;
            }
            if (player.getAppearance().getCanChangeAppearance() &&
                player.getInterfaceId() > 0) {
                //Appearance looks
                // player.getAppearance().setLook(Appearance.GENDER, gender);
                // player.getAppearance().setLook(Appearance.HEAD, apperances[0]);
                // player.getAppearance().setLook(Appearance.CHEST, apperances[2]);
                // player.getAppearance().setLook(Appearance.ARMS, apperances[3]);
                // player.getAppearance().setLook(Appearance.HANDS, apperances[4]);
                // player.getAppearance().setLook(Appearance.LEGS, apperances[5]);
                // player.getAppearance().setLook(Appearance.FEET, apperances[6]);
                // player.getAppearance().setLook(Appearance.BEARD, apperances[1]);
                // //Colors
                // player.getAppearance().setLook(Appearance.HAIR_COLOUR, colors[0]);
                // player.getAppearance().setLook(Appearance.TORSO_COLOUR, colors[1]);
                // player.getAppearance().setLook(Appearance.LEG_COLOUR, colors[2]);
                // player.getAppearance().setLook(Appearance.FEET_COLOUR, colors[3]);
                // player.getAppearance().setLook(Appearance.SKIN_COLOUR, colors[4]);
                // player.getUpdateFlag().flag(Flag.APPEARANCE);
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
        [0, 11], // hair color
        [0, 15], // torso color
        [0, 15], // legs color
        [0, 5], // feet color
        [0, 7], // skin color
    ];
    ChangeAppearancePacketListener.FEMALE_VALUES = [
        [45, 54], // head
        [-1, -1], // jaw
        [56, 60], // torso
        [61, 65], // arms
        [67, 68], // hands
        [70, 77], // legs
        [79, 80], // feet
    ];
    ChangeAppearancePacketListener.MALE_VALUES = [
        [0, 8], // head
        [10, 17], // jaw
        [18, 25], // torso
        [26, 31], // arms
        [33, 34], // hands
        [36, 40], // legs
        [42, 43], // feet
    ];
    return ChangeAppearancePacketListener;
}());
exports.ChangeAppearancePacketListener = ChangeAppearancePacketListener;
//# sourceMappingURL=ChangeAppearancePacketListener.js.map