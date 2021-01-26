int delayGen = 350;
int led13 = 13;

int minNumber = 1200;
int maxNumber = 1580;

float fltTara = 0;
int velocidad = 9600;
String salidaKG = "kg\n";

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
  pesoSalida();
}

void pesoSalida() {
  digitalWrite(led13, HIGH);
  fltTara = random(minNumber, maxNumber);
  fltTara = fltTara * 0.91536;
  salidaKG = String(fltTara) + "";
  Serial.println(salidaKG);
  delay(delayGen);
  digitalWrite(led13, LOW);
  delay(delayGen);
}