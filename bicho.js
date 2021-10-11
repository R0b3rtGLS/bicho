Android.startApp("com.panzerdog.tacticool");

var timer = new Timer();
timer.start();

var point = new Point(500, 500);
Android.sendTap(point);


Helper.log("The hard work took", timer.getElapsedTime(), "ms");

if(timer.getElapsedTime() >= 15000){
    Stats.show("General", "Progress", "10%");
    timer.stop();
}