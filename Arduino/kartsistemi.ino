/*

 Sensör Pin     NodeMCU Pin
     RST          D1 (GPIO 5)
     SDA          D2 (GPIO 4)
     MOSI         D7 (GPIO 13)
     MISO         D6 (GPIO 12)
     SCK          D5 (GPIO 14)
     3.3V         3.3V
     GND          GND
     Röle S       D0
     -            GND
     +            3.3V
     KırmızıLED   D4 (GPIO 2)
     YeşilLED     D3 (GPIO 0)

 */

// Gerekli kütüphaneleri tanımladım
#include <ESP8266WiFi.h>
#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266HTTPClient.h>

// RFID kart okuyucunun pinlerini tanımladım
constexpr uint8_t RST_PIN = 5;
constexpr uint8_t SS_PIN = 4;

// MFRC kütüphanesini bu pinlere göre düzenledim
MFRC522 rfid(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key;

// Kart ID'sini tutacağım değişkeni tanımladım
byte nuidPICC[4];

// Web arayüzünün bilgilerini girdim
String host = "http://kart-okuyucu.herokuapp.com";
String url = "/history";
String address = host + url;

// LED ve rölenin pinlerini tanımladım
int register_led = 2;
int network_led = 0;
int relay = 16;

void setup()
{
    // Serial bağlantısını başlattım
    Serial.begin(9600);
    // Wi-Fi bağlantısını aşağıdaki ayarlara göre başlattım
    WiFi.begin("netmaster", "kartokuyucu999");
    // Röle ve LED'leri çıkış olarak tanımladım
    pinMode(relay, OUTPUT);
    pinMode(register_led, OUTPUT);
    pinMode(network_led, OUTPUT);

    // Ağa bağlanana kadar beklemesini söyledim
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    // SPI ve RFID kütüphanelerini başlattım
    SPI.begin();
    rfid.PCD_Init();
}

// Zamanı çeken fonksiyonu yazdım
int gettime()
{
    // Eğer Wi-Fi ye bağlıysa
    if (WiFi.status() == WL_CONNECTED)
    {
      Serial.print("gettime");
        // HTTP kütüphanesini çağır
        HTTPClient http;
        // HTTP bağlantısını yapacağı websitesini yazdım (Zamanı bu siteden sağlayacak)
        http.begin("http://worldtimeapi.org/api/timezone/Europe/Istanbul"); //Specify request destination
        http.addHeader("Content-Type", "application/json");                 //Specify content-type header
        // Belirtilen adrese get isteği göndermesini söyledim
        int httpCode = http.GET();
        String payload = http.getString();
        // Stringin 73 ve 74. indexleri zamanı sağladığı için onu fonksiyonda return ettim
        payload = String(payload[73]) + String(payload[74]);
        int returnedPayload = payload.toInt();
        return returnedPayload;
    }
}

void loop()
{
    //Wi-Fi ye bağlandıysa
    if (WiFi.status() == WL_CONNECTED)
        // Network (Yeşil LED) yansın
        digitalWrite(network_led, HIGH);
    else
        //Bağlanmadıysa LEDi söndürsün
        digitalWrite(network_led, LOW);

    // Zamanı timeNow kütüphanesine atadım
    //int timeNow = gettime();
   // Serial.println(timeNow);
    // Yeni kart girdisini sorguladım
    if (!rfid.PICC_IsNewCardPresent())
        return;

    MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);

    // Kartın MIFARE tipinde olup olmadığını sorguladım
    if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI &&
        piccType != MFRC522::PICC_TYPE_MIFARE_1K &&
        piccType != MFRC522::PICC_TYPE_MIFARE_4K)
    {
        return;
    }

    // Eğer uyumlu bir kart ise
    if (rfid.uid.uidByte[0] and rfid.uid.uidByte[1] and rfid.uid.uidByte[2] and rfid.uid.uidByte[3])
    {
        // Serial ekrana yeni kart algılandı yazısını yazmasını söyledim
        Serial.println(F("Yeni kart algılandı."));

        // Dizime bu kartın ID'sini atadım
        for (byte i = 0; i < 4; i++)
        {
            nuidPICC[i] = rfid.uid.uidByte[i];
        }
        // Serial ekrana Kart IDsini yazdırdım
        Serial.print(F("Kart ID: "));
        String id = printHex(rfid.uid.uidByte, rfid.uid.size);
        Serial.println(id);

        // Eğer saat 8 ile 5 arasındaysa bu kartı işleme tabi tutmasını söyledim
       // if (timeNow >= 8 and timeNow <= 16)
            postJSON(id, address);
    }

    // PICC kapatmasını söyledim
    rfid.PICC_HaltA();

    // PCD şifrelemesini kapattım
    rfid.PCD_StopCrypto1();
}

// Kartın ID'sini hexe çeviren fonksiyon
String printHex(byte *buffer, byte bufferSize)
{
    String id;
    for (byte i = 0; i < bufferSize; i++)
    {
        id += String(buffer[i] < 0x10 ? " 0" : " ");
        id += String(buffer[i], HEX);
    }
    id.toUpperCase();
    id.trim();
    return id;
}

// Kartı Web sitesine yazan fonksiyon
void postJSON(String cardId, String address)
{
    // Eğer Wi-Fi bağlantısı varsa
    if (WiFi.status() == WL_CONNECTED)
    {
        // HTTP kütüphanesini çağır
        HTTPClient http;
        // Parametredeki adrese HTTP ile bağlanmasını söyledim
        http.begin(address);
        http.addHeader("Content-Type", "application/json");

        // HTTP bağlantısı kurduğum adrese POST isteği ile Kart ID sini gönderdim
        int httpCode = http.POST("{ \"cardId\" : \"" + cardId + "\" }");
        String payload = http.getString();
        Serial.println(payload);
        // Web sitesinden gelen sonuç Giriş veya çıkış kaydı alındı ise
        if (payload == "Giriş kaydınız alındı" or payload == "Çıkış kaydınız alındı")
        {
            // Kapıyı aç
            digitalWrite(relay, HIGH);
            delay(1000);
            digitalWrite(relay, LOW);
            // Geçersiz kart LEDini sönük tut
            digitalWrite(register_led, LOW);
        }
        // Eğer kart kayıtlı değilse 2 saniye boyunca kayıtsız kart LEDini yak ve söndür
        else
        {
            digitalWrite(register_led, HIGH);
            delay(2000);
            digitalWrite(register_led, LOW);
        }
        http.end(); // HTTP bağlantısını sonlandır
    }
}
