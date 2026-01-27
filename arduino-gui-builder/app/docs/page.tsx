"use client";

import Link from "next/link";
import { ArrowLeft, Copy } from "lucide-react";

export default function DocsPage() {
    const arduinoCode = `
// Arduino / ESP32 Code for GUI Builder
// Reads "PIN:VALUE" from Serial and acts on it.

void setup() {
  Serial.begin(9600);
  
  // Initialize some pins if needed, though dynamic is better
  // Common built-in LED
  pinMode(2, OUTPUT); 
}

void loop() {
  if (Serial.available() > 0) {
    String data = Serial.readStringUntil('\\n');
    data.trim();
    
    if (data.length() > 0) {
      int separatorIndex = data.indexOf(':');
      if (separatorIndex != -1) {
        String pinStr = data.substring(0, separatorIndex);
        String valStr = data.substring(separatorIndex + 1);
        
        int pin = pinStr.toInt();
        int val = valStr.toInt();
        
        // Safety check for valid pins
        if (pin >= 0) {
          // Determine if Digital (0/1) or Analog (PWM) based on value or config
          // Optimistic approach: if val is 0 or 1, create strict logic? 
          // Or just analogWrite (on ESP32 standard pins support PWM via ledc, 
          // but Arduino uses analogWrite).
          
          // Simple implementation for Digital/PWM mixed:
          if (val == 0 || val == 1) {
             digitalWrite(pin, val);
          } else {
             analogWrite(pin, val); // Ensure pin supports PWM
          }
           
          // Echo back for debugging
          Serial.print("Set Pin ");
          Serial.print(pin);
          Serial.print(" to ");
          Serial.println(val);
        }
      }
    }
  }
}
  `.trim();

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </Link>

                <h1 className="text-4xl font-bold mb-6">Documentation</h1>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-blue-400">1. Getting Started</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        <li>Create a new project from the home page.</li>
                        <li>Drag specific components (Button, Slider) onto the canvas.</li>
                        <li>Click a component to edit its properties (Pin number, etc).</li>
                        <li>Use <strong>Pin</strong> property to specify the GPIO pin on your board (e.g., 2, 13, A0).</li>
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-blue-400">2. Arduino/ESP32 Setup</h2>
                    <p className="mb-4 text-gray-300">
                        Flash the following code to your microcontroller to interpret the commands sent by this app.
                    </p>

                    <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-700">
                            <span className="text-xs font-mono text-gray-500">main.ino</span>
                            <button
                                onClick={() => navigator.clipboard.writeText(arduinoCode)}
                                className="text-xs flex items-center gap-1 text-gray-400 hover:text-white"
                            >
                                <Copy className="w-3 h-3" /> Copy
                            </button>
                        </div>
                        <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto">
                            {arduinoCode}
                        </pre>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-blue-400">3. Troubleshooting</h2>
                    <p className="text-gray-300">
                        <strong>Browser Support:</strong> This app requires the Web Serial API, available in Chrome, Edge, and Opera. standard Firefox does not support it yet.<br /><br />
                        <strong>Connection Issues:</strong> Ensure your device driver is installed (e.g., CH340, CP2102) and no other serial monitor (like Arduino IDE) is using the port.
                    </p>
                </section>
            </div>
        </div>
    );
}
