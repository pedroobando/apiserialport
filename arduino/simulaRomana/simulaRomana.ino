int delayGen = 500;
int led13 = 13;

int minNumber = 1200;
int maxNumber = 1300;

float fltTara = 0;
int pesoEstable = 0;
int velocidad = 9600;
String salidaKG = "";


void setup() {
  Serial.begin(velocidad);
  Serial.setTimeout(50);
  fltTara = 0;
  pinMode(led13, OUTPUT);
  digitalWrite(led13, LOW);

  //Establecemos la semilla en un pin analogico
  randomSeed(analogRead(0));
}

void loop() {
  if(Serial.available()) {
    String data = Serial.readStringUntil('\n');
//    Serial.println(data);
    pesoSalida();
//    data = Serial.read();
//    if(data>='A' && data <='Z') {
//      pesoSalida();
//    }
  }

  
}

void pesoSalida() {
  digitalWrite(led13, HIGH);
  pesoEstable = random(0,2);
  fltTara = random(minNumber, maxNumber);
  fltTara = fltTara * 1.231;
  salidaKG = String(fltTara)+"KG";

  Serial.println("");
  Serial.println(salidaKG);
  Serial.println("");
  Serial.println("S"+String(pesoEstable)+"0");
  delay(delayGen);
  digitalWrite(led13, LOW);
//  delay(delayGen);
}
