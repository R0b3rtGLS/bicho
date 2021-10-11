//Android.startApp("com.panzerdog.tacticool");

var timer = new Timer();
timer.start();



var point = new Point(500, 500);
Android.sendTap(point);


if(Timer.getElapsedTime() >= 15000){
    Stats.show("General", "Progress", "10%");
}