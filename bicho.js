Helper.msleep(22000);

var timer = new Timer();
timer.start();

Android.startApp("com.panzerdog.tacticool");
Helper.sleep(18);

if(timer.getElapsedTime() >= 22000){
    Stats.show("General", "Progress", "10%");
    timer.stop();

    var point = new Point(1260, 1350);
    Android.sendTap(point);
}