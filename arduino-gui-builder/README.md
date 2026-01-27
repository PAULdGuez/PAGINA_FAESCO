# Arduino GUI Builder

A web-based visual interface builder for Arduino and ESP32 projects. Create custom control dashboards with drag & drop components and interact with your hardware in real-time via Web Serial API.

## Features

- 🖱️ **Drag & Drop Builder**: Create interfaces with Buttons, Sliders, Labels, and LEDs.
- 🔗 **Web Serial Integration**: Communicate directly with your microcontroller directly from the browser (Chrome/Edge).
- 💾 **Project Persistence**: Projects are saved automatically to your browser's local storage.
- ⚡ **Real-time Control**: Instant feedback and control of connected hardware.

## Getting Started

### Prerequisites

- Node.js 18+ installed on your computer.
- A supported browser (Chrome, Edge, Opera) for Web Serial API.
- An Arduino, ESP32, or similar microcontroller.

### Installation

1. Navigate to the project directory:
   ```bash
   cd arduino-gui-builder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

1. **Create a Project**: Click "Creating Project" on the home page.
2. **Design Interface**: Drag components from the sidebar to the canvas.
3. **Configure**: Click a component to set its properties:
   - **Label**: Display text.
   - **Pin**: The GPIO pin number on your board (e.g., `13`, `A0`).
   - **Min/Max**: For sliders.
4. **Program Hardware**: Upload the example code (found in **Documentation**) to your Arduino.
5. **Run**: Click the "Run" button, connect your device, and start controlling!

## Project Structure

- `app/`: Next.js App Router pages.
- `components/builder/`: Editor components (Canvas, Toolbar).
- `components/widgets/`: UI elements (Button, Slider).
- `store/`: State management (Zustand).
- `hooks/`: Custom hooks (Web Serial).

## Technologies

- Next.js 14
- TypeScript
- Tailwind CSS
- Zustand (State)
- dnd-kit (Drag & Drop)
- Lucide React (Icons)

## License

MIT
