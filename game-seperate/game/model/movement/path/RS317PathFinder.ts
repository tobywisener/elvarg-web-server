
import { Mobile } from "../../../entity/impl/Mobile";
import { Location } from "../../Location";
import { RegionManager } from "../../../collision/RegionManager";

export class RS317PathFinder {

    private static readonly DEFAULT_PATH_LENGTH = 4000;

    public static findPath(gc: Mobile, destX: number, destY: number, moveNear: boolean, xLength: number, yLength: number) {
        try {
            if (destX == gc.getLocation().getRegionX() && destY == gc.getLocation().getRegionY() && !moveNear) {
                return;
            }

            const height = gc.getLocation().getZ() % 4;
            destX = destX - 8 * gc.getLocation().getRegionX();
            destY = destY - 8 * gc.getLocation().getRegionY();
            const via = new Array(104).fill(0).map(() => new Array(104).fill(0));
            const cost = new Array(104).fill(0).map(() => new Array(104).fill(99999999));
            const tileQueueX: number[] = [];
            const tileQueueY: number[] = [];
            const privateArea = gc.getPrivateArea();
            for (let xx = 0; xx < 104; xx++) {
                for (let yy = 0; yy < 104; yy++) {
                    cost[xx][yy] = 99999999;
                }
            }
            let curX = gc.getLocation().getRegionX();
            let curY = gc.getLocation().getRegionY();
            if (curX > via.length - 1 || curY > via[curX].length - 1) {
                return;
            }
            if (curX < via.length && curY < via[0].length) {
                via[curX][curY] = 99;
            }
            if (curX < cost.length && curY < cost[0].length) {
                cost[curX][curY] = 0;
            }
            let tail = 0;
            tileQueueX.push(curX);
            tileQueueY.push(curY);
            let foundPath = false;
            while (tail != tileQueueX.length && tileQueueX.length < RS317PathFinder.DEFAULT_PATH_LENGTH) {
                curX = tileQueueX[tail];
                curY = tileQueueY[tail];
                const curAbsX = gc.getLocation().getRegionX() * 8 + curX;
                const curAbsY = gc.getLocation().getRegionY() * 8 + curY;
                if (curX == destX && curY == destY) {
                    foundPath = true;
                    break;
                }
                tail = (tail + 1) % RS317PathFinder.DEFAULT_PATH_LENGTH;

                if (cost.length < curX || cost[curX].length < curY) {
                    return;
                }
                const thisCost = cost[curX][curY] + 1;

                if (curY > 0
                    && via[curX][curY - 1] == 0
                    && (RegionManager.getClipping(curAbsX, curAbsY - 1, height, privateArea) & 0x1280102) == 0) {
                    tileQueueX.push(curX);
                    tileQueueY.push(curY - 1);
                    via[curX][curY - 1] = 1;
                    cost[curX][curY - 1] = thisCost;
                }
                if (curX > 0
                    && via[curX - 1][curY] == 0
                    && (RegionManager.getClipping(curAbsX - 1, curAbsY, height, privateArea) & 0x1280108) == 0) {
                    tileQueueX.push(curX - 1);
                    tileQueueY.push(curY);
                    via[curX - 1][curY] = 2;
                    cost[curX - 1][curY] = thisCost;
                }
                if (curY < 104 - 1
                    && via[curX][curY + 1] == 0
                    && (RegionManager.getClipping(curAbsX, curAbsY + 1, height, privateArea) & 0x1280120) == 0) {
                    tileQueueX.push(curX);
                    tileQueueY.push(curY + 1);
                    via[curX][curY + 1] = 4;
                    cost[curX][curY + 1] = thisCost;
                }
                if (curX < 104 - 1
                    && via[curX + 1][curY] == 0
                    && (RegionManager.getClipping(curAbsX + 1, curAbsY, height, privateArea) & 0x1280180) == 0) {
                    tileQueueX.push(curX + 1);
                    tileQueueY.push(curY);
                    via[curX + 1][curY] = 8;
                    cost[curX + 1][curY] = thisCost;
                }
                if (curX > 0
                    && curY > 0
                    && via[curX - 1][curY - 1] == 0
                    && (RegionManager.getClipping(curAbsX - 1, curAbsY - 1, height, privateArea) & 0x128010e) == 0
                    && (RegionManager.getClipping(curAbsX - 1, curAbsY, height, privateArea) & 0x1280108) == 0
                    && (RegionManager.getClipping(curAbsX, curAbsY - 1, height, privateArea) & 0x1280102) == 0) {
                    tileQueueX.push(curX - 1);
                    tileQueueY.push(curY - 1);
                    via[curX - 1][curY - 1] = 3;
                    cost[curX - 1][curY - 1] = thisCost;
                }
                if (curX > 0
                    && curY < 104 - 1
                    && via[curX - 1][curY + 1] === 0
                    && (RegionManager.getClipping(curAbsX - 1, curAbsY + 1, height, privateArea) & 0x1280138) === 0
                    && (RegionManager.getClipping(curAbsX - 1, curAbsY, height, privateArea) & 0x1280108) === 0
                    && (RegionManager.getClipping(curAbsX, curAbsY + 1, height, privateArea) & 0x1280120) === 0) {
                    tileQueueX.push(curX - 1);
                    tileQueueY.push(curY + 1);
                    via[curX - 1][curY + 1] = 6;
                    cost[curX - 1][curY + 1] = thisCost;
                }
                if (curX < 104 - 1
                    && curY > 0
                    && via[curX + 1][curY - 1] === 0
                    && (RegionManager.getClipping(curAbsX + 1, curAbsY - 1, height, privateArea) & 0x1280183) === 0
                    && (RegionManager.getClipping(curAbsX + 1, curAbsY, height, privateArea) & 0x1280180) === 0
                    && (RegionManager.getClipping(curAbsX, curAbsY - 1, height, privateArea) & 0x1280102) === 0) {
                    tileQueueX.push(curX + 1);
                    tileQueueY.push(curY - 1);
                    via[curX + 1][curY - 1] = 9;
                    cost[curX + 1][curY - 1] = thisCost;
                }
                if (curX < 104 - 1
                    && curY < 104 - 1
                    && via[curX + 1][curY + 1] === 0
                    && (RegionManager.getClipping(curAbsX + 1, curAbsY + 1, height, privateArea) & 0x12801e0) === 0
                    && (RegionManager.getClipping(curAbsX + 1, curAbsY, height, privateArea) & 0x1280180) === 0
                    && (RegionManager.getClipping(curAbsX, curAbsY + 1, height, privateArea) & 0x1280120) === 0) {
                    tileQueueX.push(curX + 1);
                    tileQueueY.push(curY + 1);
                    via[curX + 1][curY + 1] = 12;
                    cost[curX + 1][curY + 1] = thisCost;
                }
            }
            if (!foundPath) {
                if (moveNear) {
                    let i_223_ = 1000;
                    let thisCost = 100;
                    const i_225_ = 10;
                    for (let x = destX - i_225_; x <= destX + i_225_; x++) {
                        for (let y = destY - i_225_; y <= destY + i_225_; y++) {
                            if (x >= 0 && y >= 0 && x < 104 && y < 104 && cost[x][y] < 100) {
                                let i_228_ = 0;
                                if (x < destX) {
                                    i_228_ = destX - x;
                                } else if (x > destX + xLength - 1) {
                                    i_228_ = x - (destX + xLength - 1);
                                }
                                let i_229_ = 0;
                                if (y < destY) {
                                    i_229_ = destY - y;
                                } else if (y > destY + yLength - 1) {
                                    i_229_ = y - (destY + yLength - 1);
                                }
                                const i_230_ = i_228_ * i_228_ + i_229_ * i_229_;
                                if (i_230_ < i_223_ || i_230_ === i_223_ && cost[x][y] < thisCost) {
                                    i_223_ = i_230_;
                                    thisCost = cost[x][y];
                                    curX = x;
                                    curY = y;
                                }
                            }
                        }
                    }
                    if (i_223_ === 1000) {
                        return;
                    }
                } else {
                    return;
                }
            }
            tail = 0;
            tileQueueX.push(tail, curX);
            tileQueueY.push(tail++, curY);
            let l5;
            for (let j5 = l5 = via[curX][curY]; curX !== gc.getLocation().getRegionX() || curY !== gc.getLocation().getRegionY(); j5 = via[curX][curY]) {
                if (j5 !== l5) {
                    l5 = j5;
                    tileQueueX.push(tail, curX);
                    tileQueueY.push(tail++, curY);
                }
                if ((j5 & 2) !== 0) {
                    curX++;
                } else if ((j5 & 8) !== 0) {
                    curX--;
                }
                if ((j5 & 1) !== 0) {
                    curY++;
                } else if ((j5 & 4) !== 0) {
                    curY--;
                }
            }
            const size = tail--;
            let pathX = gc.getLocation().getRegionX() * 8 + tileQueueX[tail];
            let pathY = gc.getLocation().getRegionY() * 8 + tileQueueY[tail];
            gc.getMovementQueue().addFirstStep(new Location(pathX, pathY, gc.getLocation().getZ()));
            for (let i = 1; i < size; i++) {
                tail--;
                pathX = gc.getLocation().getRegionX() * 8 + tileQueueX[tail];
                pathY = gc.getLocation().getRegionY() * 8 + tileQueueY[tail];
                gc.getMovementQueue().addSteps(new Location(pathX, pathY, gc.getLocation().getZ()));
            }
        } catch (e) {
            console.log(e);
            console.log(`Error finding route, destx: ${destX}, destY: ${destY}. Reseted queue.`);
            gc.setFollowing(null);
            gc.setMobileInteraction(null);
            gc.getMovementQueue().reset();
        }
    }

    public static isInDiagonalBlock(attacker: Location, attacked: Location): boolean {
        return attacked.getX() - 1 === attacker.getX() && attacked.getY() + 1 === attacker.getY()
            || attacker.getX() - 1 === attacked.getX() && attacker.getY() + 1 === attacked.getY()
            || attacked.getX() + 1 === attacker.getX() && attacked.getY() - 1 === attacker.getY()
            || attacker.getX() + 1 === attacked.getX() && attacker.getY() - 1 === attacked.getY()
            || attacked.getX() + 1 === attacker.getX() && attacked.getY() + 1 === attacker.getY()
            || attacker.getX() + 1 === attacked.getX() && attacker.getY() + 1 === attacked.getY();
    }
}