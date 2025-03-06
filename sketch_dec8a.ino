#include <Modulino.h>
#include <ArduinoGraphics.h>
#include <Arduino_LED_Matrix.h>


ModulinoThermo sens;
float temp, hum;
ArduinoLEDMatrix matrix;
char msg[30];

ModulinoButtons buttons;
bool button_a = false;
bool button_b = false;
bool button_c = false;

ModulinoBuzzer buzzer;
int frequency = 440;
int duration = 1000;
int frequency1 = 240;
int duration1 = 1000;
int frequency2 = 340;
int duration2 = 1000;
int frequency3 = 540;
int duration3 = 4000;

ModulinoPixels leds;
int brightness = 25;

ModulinoKnob knob;

ModulinoColor OFF(0, 0, 0);
int brightness = 25;



void setup() {
  Modulino.begin();

  sens.begin();
  matrix.begin();

  Serial.begin(9600);
  buttons.begin();
  buttons.setLeds(true, true, true);

  buzzer.begin();

  leds.begin();

  Serial.begin(9600);
  knob.begin();

  leds.begin();

  {

 

}

void loop() {
   
   
   if (buttons.update()) {
    if (buttons.isPressed(0)) {
       
       temp = sens.getTemperature();
       hum = sens.getHumidity();
       sprintf(msg, " %d.%dC %d.%d%% ", (int)temp, (int)(temp*10)%10, (int)hum, (int)(hum*10)%10);
       matrix.beginDraw();
       matrix.textScrollSpeed(70);
       matrix.textFont(Font_5x7);
       matrix.beginText(0,1,0xFFFFFF);
       matrix.println(msg);
       matrix.endText(SCROLL_LEFT);
       matrix.endDraw();

    } else if (buttons.isPressed(1)) {
      
      buzzer.tone(frequency, duration);
      delay(1000);
      buzzer.tone(0, duration);
      delay(1000);
      buzzer.tone(frequency1, duration1);
      delay(1000);
      buzzer.tone(0, duration1);
      delay(1000);
      buzzer.tone(frequency2, duration2);
      delay(1000);
      buzzer.tone(0, duration2);
      delay(1000);
      buzzer.tone(frequency3, duration3);
      delay(1000);
      buzzer.tone(0, duration3);
      delay(1000);

    } else if (buttons.isPressed(2)) {

      
     int position = knob.get();
     bool click = knob.isPressed();
     Serial.print("Current position is: ");
     Serial.println(position);
     else if(click){
     Serial.println("Clicked!");

      for (int i = 0; i < 8; i++) {
    if (i == 0 || i == 1) {
      setPixel(i, RED);
    } else if (i == 2 || i == 3) {
      setPixel(i, BLUE);
    } else if(i == 4 || i == 5){
      setPixel(i, GREEN);
    } else if(i == 6 || i == 7){
      setPixel(i, VIOLET);
    } else if (i == 7 || i == 8) {
      setPixel(i, WHITE);
    }

  delay(25);

  }
  
  for (int i = 0; i < 8; i++) {
    setPixel(i, OFF);
    delay(25);
  }

}


     


  }
      

      
      
      
      
         

    }
  }
  
 
  

}




