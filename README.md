# LED Control System

Automated LED control system that adjusts lighting based on sunrise and sunset times for your REOLINK camera. The system interfaces with a network camera's LED controls and automatically updates the lighting schedule.

## Features

- Fetches daily sunrise and sunset times based on geographical location
- Authenticates with the network camera
- Controls LED lighting schedule automatically
- Error handling and logging
- Timezone support

## Prerequisites

- Your camera must have HTTP enabled
- Node.js 14 or higher
- npm
- Network camera with LED control capabilities
- Internet connection for sunrise/sunset API

## Installation

```bash
npm install
````

## Usage

```bash
ts-node src/index.ts
```
