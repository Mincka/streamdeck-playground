# Stream Deck Playground

This repository contains a set of actions for the Stream Deck, serving as a personal sandbox to experiment with the Stream Deck SDK.

## Features

This plugin includes two custom actions:

### 1. Counter Action
- **UUID**: `com.mincka.playground.increment`
- **Type**: Button action for Stream Deck keypad
- **Functionality**: 
  - Displays a numeric counter that increments by 1 each time the button is pressed
  - Shows the current count as the button title
  - Alternates between red and blue circle graphics based on even/odd count values
  - Includes property inspector settings to configure increment value (1-5)

### 2. Now Playing Action  
- **UUID**: `com.mincka.playground.now-playing`
- **Type**: Multi-controller action (works on both keypad buttons and Stream Deck+ encoders/dials)
- **Functionality**:
  - Displays content from a text file (`data/display.txt`) as the button title
  - Button press refreshes the displayed content
  - **Stream Deck+ Encoder Support**: When used on a dial, rotating it displays an animated sequence of images on the LCD screen above the dial
  - Uses layout `$A0` for full-canvas image display on Stream Deck+

## Requirements

- **Stream Deck Software**: Version 6.4 or higher
- **Operating Systems**: 
  - macOS 10.15 or higher
  - Windows 10 or higher
- **Node.js**: Version 20 (automatically managed by Stream Deck)

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/Mincka/streamdeck-playground.git
   cd streamdeck-playground
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the plugin:
   ```bash
   npm run build
   ```

4. Install the plugin in Stream Deck:
   - Copy the `com.mincka.playground.sdPlugin` folder to your Stream Deck plugins directory
   - Or use the Stream Deck CLI: `streamdeck install com.mincka.playground.sdPlugin`

## Usage

### Counter Action
1. Drag the "Counter" action from the Playground category to a Stream Deck button
2. Press the button to increment the counter
3. Use the Property Inspector to adjust the increment value (currently ranges from 1-5)

### Now Playing Action
1. Create a `data/display.txt` file in your plugin directory with the content you want to display
2. Drag the "Now Playing" action to a Stream Deck button or encoder
3. **For buttons**: Press to refresh the displayed content from the file
4. **For Stream Deck+ encoders**: Rotate the dial to trigger an animated image sequence on the LCD screen

## Development

### Build Commands

- **Build once**: `npm run build`
- **Watch mode**: `npm run watch` (rebuilds on changes and restarts the plugin)

### Project Structure

```
├── src/
│   ├── actions/
│   │   ├── increment-counter.ts    # Counter action implementation
│   │   └── now-playing.ts          # Now playing action implementation
│   └── plugin.ts                   # Main plugin entry point
├── com.mincka.playground.sdPlugin/
│   ├── manifest.json              # Plugin manifest and action definitions
│   ├── imgs/                      # Action icons and images
│   └── ui/
│       └── increment-counter.html  # Property inspector for counter action
├── rollup.config.mjs              # Build configuration
└── package.json                   # Dependencies and scripts
```

### Development Notes

- Built with TypeScript and the official `@elgato/streamdeck` SDK
- Uses Rollup for bundling
- Includes trace-level logging for debugging
- The Now Playing action includes experimental image generation features (currently using static images)

## SDK Documentation

This plugin is built using the official Elgato Stream Deck SDK:
- [Stream Deck SDK Documentation](https://docs.elgato.com/sdk/)
- [TypeScript SDK on npm](https://www.npmjs.com/package/@elgato/streamdeck)

## License

MIT License - see [LICENSE](LICENSE) file for details.
