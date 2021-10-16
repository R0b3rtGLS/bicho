// +---------------------+
// | Version Information |
// +---------------------+
for (var i=0; i<3; i++) { Helper.log(" "); }
Helper.log("### BOTFATHER VERSION 6.6.0 OR LATER REQUIRED ###")
Helper.log("(You might need to update)");
for (var i=0; i<3; i++) { Helper.log(" "); }

// +---------------------+
// | Adnroid Device Check|
// +---------------------+
var appPackage = "com.panzerdog.tacticool";

if(Android.connected()) {
    Helper.log("Found Device, trying to start bicho...");
    main();
} else {
    Helper.log("No device connected!");
}

// +---------------------------------------------------------------------+
// | Templates and Data (DON'T TOUCH ANYTHING BELOW THIS LINE AS A USER) |
// +---------------------------------------------------------------------+

function main() {
    Helper.log("Welcome to Tacticool Bicho v1");
    Helper.log("Checking if the game is installed...");
    Helper.log("Trying to start the game...");
    Android.startApp(appPackage);

    gameLoop();
    //testGame();
}

function testGame(){
    while(true){
        //moveTap(503, 1085, 546, 401);
        //cameraTap(2447, 650, 1779, 724);

        //Get Size:
        var size = Android.getSize();
        Helper.log(size);
        //Take Screenshot:
        var scrn = Android.takeScreenshot();
        //get matches to determine state:
        var results = matches(scrn);
    }
}

function moveTap(x1, y1, x2, y2) {
    Android.sendSwipe(new Point(x1, y1), new Point(x2, y2), 5000);
}

function cameraTap(x1, y1, x2, y2){
    Android.sendSwipe(new Point(x1, y1), new Point(x2, y2), 2000);
}

function gameLoop() {
    var cont = 1;
    var lastActionResult = true;
    while(cont) {
        //Get Size:
        var size = Android.getSize();
        Helper.log(size);
        //Take Screenshot:
        //var scrn = Android.takeScreenshot();

        var SYNDROME = new Image("syndrome.png");

        //get matches to determine state:
        var results = matches(SYNDROME);
        
        //var state = detectState(results);
        //Helper.log("Determined state: " + state);
        //act on detected state:
        //if(stateAction(state, results)) {
        //    Helper.log("Current loop finished!");
        //} else {
        //    if(lastActionResult) {
        //        Helper.log("Encountered a Problem, trying again!");
        //    } else {
        //        Helper.log("Encountered a Problem on action!");
        //        return 1;
        //    }
        //}
    }
}

function matches(scrn) {
    //Copy scrn:
    /*if(Config.getValue("prntMatches")) {
        scrn.save("scrnmatches.png");
        var scrnmatches = new Image
        scrnmatches.load("scrnmatches.png");
    }*/
    //test:
    var toTest = {
        characters:{
            tmplt: "syndrome.png",
            score: 0.99
        }
    }
    var allmatches = [];
    var results = {};
    //run checks:
    Object.keys(toTest).forEach(function(key) {
        var vals = toTest[key];
        Helper.log("Comparing current screenshot with " + vals.tmplt + " Min Score: " + vals.score);
        //Try to find matches
        var template = new Image(vals.tmplt);
        var matches = Vision.findMatches(scrn, template, vals.score);
        //Set results
        if(matches.length > 0) {
            allmatches = allmatches.concat(matches);
            results[key] = matches;
        }
    });
    Object.keys(results).forEach(function(key) {
        var vals = results[key];
        Helper.log(Object.keys(vals).length + " Results found for " + key);
    });
    Helper.log(allmatches.length + " Matches for various checks found.");
    if(Config.getValue("menu")) {
        var gold = new Color(255,215,0);
        scrnmatches = Vision.markMatches(scrn, allmatches, gold, 4);
        scrnmatches.save("syndrome.png");
    }
    return results;
}

function detectState(results) {
    var resultKeys = Object.keys(results);
    Helper.log("Trying to determine gamestate from the following: " + resultKeys);
    //check if game is still booting:
    if(typeof(results.booting) == "object" && Object.keys(results.booting).length > 0) {
        Helper.log("Detected game is in booting!");
        return "booting";
    }
    //Check overlays
    if(typeof(results.dailyEvent) == "object" && Object.keys(results.dailyEvent).length > 0) {
        Helper.log("Detected Daily Event!");
        return "dailyEvent";
    }
    if(typeof(results.bossSelection) == "object" && Object.keys(results.bossSelection).length > 0) {
        Helper.log("Detected Boss Selection Screen");
        if(typeof(results.confirmBossBattleBtn) == "object" && Object.keys(results.confirmBossBattleBtn).length > 0) {
            return "bossBattleConfirmation";
        }
        return "bossSelection";
    }
    if((typeof(results.bossLootScreen) == "object" && Object.keys(results.bossLootScreen).length > 0) ||
    (typeof(results.bossLootSellMatBtn) == "object" && Object.keys(results.bossLootSellMatBtn) > 0) ||
    (typeof(results.bossLootSellMoneyBtn) == "object" && Object.keys(results.bossLootSellMoneyBtn) > 0) ||
    (typeof(results.bossLootGetBtn) == "object" && Object.keys(results.bossLootGetBtn) > 0)) {
        Helper.log("Detected Boss Loot Screen");
        return "bossLootScreen";
    }
    if(typeof(results.bossTreasure) == "object" && Object.keys(results.bossTreasure).length > 0) {
        Helper.log("Detected Boss Treasure screen. nothing to do here but wait.");
        return "bossTreasureScreen";
    }
    //check if main screen:
    if(typeof(results.main) == "object" && Object.keys(results.main).length > 0) {
        Helper.log("Detected Main Screen");
        return "main";
    }
    return "unknown";
}

function stateAction(state, results) {
    if(state == "unknown") {
        Helper.log("Game has an unknown status, waiting another loop.");
        return true;
    }
    if(state == "booting") {
        Helper.log("Game is still booting, waiting!");
        return true;
    }
    if(state == "dailyEvent") {
        //check if closebtn was detected
        if(typeof(results.eventCloseBtn) == "object" && Object.keys(results.eventCloseBtn).length > 0) {
            //Click the closebtn:
            return AndroidRandomTap(results.eventCloseBtn[0]);
        }
        return false;
    }
    if(state == "bossSelection") {
        if(Config.getValue("farmDragon")) {
            //start specified dragon:
            var drgn = Config.getValue("dragon");
            switch (drgn) {
                case "green":
                    AndroidRandomTap(results.greenDragonBtn[0]);
                    break;
                case "black":
                    AndroidRandomTap(results.blackDragonBtn[0]);
                    break;
                case "red":
                    AndroidRandomTap(results.redDragonBtn[0]);
                    break;
                case "sin":
                    AndroidRandomTap(results.sinDragonBtn[0]);
                    break;
                case "legendary":
                    AndroidRandomTap(results.legendaryDragonBtn[0]);
                    break;
                case "bone":
                    AndroidRandomTap(results.boneDragonBtn[0]);
                    break;
                default:
                    AndroidRandomTap(results.greenDragonBtn[0]);
                    break;
            }
            return true;
        } else {
            //close boss screen:
            Helper.log("Boss Selection screen detected, farming is not activated, closing.");
            return AndroidBottomRightTap(results.bossSelection[0]);
        }
    }
    if(state == "bossBattleConfirmation") {
        if(Config.getValue("farmDragon")) {
            //start specified dragon:
            return AndroidRandomTap(results.confirmBossBattleBtn[0]);
        }
        Helper.log("Boss Selection screen detected, boss farming is not activated! Closing boss Selection screen...");
        return AndroidBottomRightTap(results.bossSelection[0]);
    }
    if(state == "bossTreasureScreen") {
        Helper.log("Waiting for Treasure screen to go.");
        Helper.sleep(2);
        return true;
    }
    if(state == "bossLootScreen") {
        //get what to do with the loot:
        var wtd = Config.getValue("sellLoot");
        switch (wtd) {
            case "money":
                Helper.log("selling loot for money.");
                AndroidRandomTap(results.bossLootSellMoneyBtn[0]);
                Helper.sleep(1);
                AndroidRandomTap(results.bossLootSellMoneyBtn[0]);
                break;
            case "mat":
                Helper.log("selling loot for mats.");
                AndroidRandomTap(results.bossLootSellMatBtn[0]);
                Helper.sleep(1);
                AndroidRandomTap(results.bossLootSellMatBtn[0]);
                break;
            case "inventory":
            default:
                Helper.log("getting loot in inventory.");
                AndroidRandomTap(results.bossLootGetBtn[0]);
                Helper.sleep(1);
                AndroidRandomTap(results.bossLootGetBtn[0]);
                break;
        }
        return true;
    }
    if(state == "main") {
        if(Config.getValue("farmDragon")) {
            //try to start bossfight:
            if(typeof(results.dragonStatueBtn) == "object" && Object.keys(results.dragonStatueBtn).length > 0) {
                //dragonstatue button was detected, tap.
                return AndroidRandomTap(results.dragonStatueBtn[0]);
            }
        } else {
            Helper.log("Bot has nothing to do! stopping");
            return false;
        }
        return false;
    }
    return false;
}

function AndroidRandomTap(match) {
    if(Android.sendTap(match.getRect().randomPoint())) {
        return true;
    }
    return false;
}

function AndroidBottomRightTap(match) {
    if(Android.sendTap(match.getRect().getBottomRight())) {
        return true;
    }
    return false;
}