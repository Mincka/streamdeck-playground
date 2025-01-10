import { action, KeyDownEvent, SingletonAction, WillAppearEvent, DialRotateEvent, Target } from "@elgato/streamdeck";
import fs from "fs";
import path from "path";
import streamDeck from "@elgato/streamdeck";
import sharp from "sharp";
import { LogLevel } from "@elgato/streamdeck";

/**
 * An action class that displays the contents of a text file on the Stream Deck+ screen above the dials and buttons.
 */
@action({ UUID: "com.mincka.playground.now-playing" })
export class NowPlaying extends SingletonAction<TextFileSettings> {

    /**
     * Path to the text file to read and display.
     */
    private readonly filePath = path.resolve(
        path.dirname(new URL(import.meta.url).pathname).replace(/^\/([a-zA-Z]:)/, "$1"),
        "data",
        "display.txt"
    );

    /**
     * Event triggered when the action becomes visible.
     */
    override async onWillAppear(ev: WillAppearEvent<TextFileSettings>): Promise<void> {
        streamDeck.logger.setLevel(LogLevel.TRACE);
        streamDeck.logger.info("onWillAppear event triggered");
        try {
            streamDeck.logger.info("Reading content from file:", this.filePath);
            const content = this.readFileContent();
            streamDeck.logger.info("File content read successfully:", content);
            await ev.action.setTitle(content);
        } catch (error) {
            streamDeck.logger.error("Failed to read or display file content:", error);
            await ev.action.setTitle("Error");
        }
        if(ev.action.isDial())
        {
            const base64Image = `data:image/png;base64,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`;

            // Set the layout and feedback payload
            ev.action.setFeedbackLayout("$A0");
            await ev.action.setFeedback({
                //title: `Count: ${counter}`, // Optional title for context
                title: '',
                'full-canvas': base64Image // 'canvas' or 'full-canvas' in A0 layout
            });        
        }
    }

    /**
     * Event triggered when the button is pressed. Refreshes the display content.
     */
    override async onKeyDown(ev: KeyDownEvent<TextFileSettings>): Promise<void> {
        streamDeck.logger.info("onKeyDown event triggered");
        try {
            streamDeck.logger.info("Refreshing content from file:", this.filePath);
            const content = this.readFileContent();
            streamDeck.logger.info("File content refreshed successfully:", content);
            await ev.action.setTitle(content);
        } catch (error) {
            streamDeck.logger.error("Failed to refresh file content:", error);
            await ev.action.setTitle("Error");
        }
    }

    /**
     * Event triggered when the dial is rotated. Displays custom images or content.
     */
    override async onDialRotate(ev: DialRotateEvent<TextFileSettings>): Promise<void> {
        streamDeck.logger.info("onDialRotate event triggered");
        // try {
        //     // Generate or load a static/dynamic image
        //     const imageBuffer = await this.generateDynamicImage(ev.payload.ticks);
    
        //     // Convert the image to Base64
        //     const base64Image = `data:image/png;base64,${imageBuffer.toString("base64")}`;
    
        //     // Set the image for Layout A0
        //     await ev.action.setImage(base64Image);
    
        //     streamDeck.logger.info("Dynamic image displayed on Layout A0 canvas");
        // } catch (error) {
        //     console.error("Failed to display image on Layout A0 canvas:", error);
        //     await ev.action.setFeedback({ titlee: "Error" }); // Optional fallback
        // }

        // streamDeck.logger.info("onDialRotate event triggered");
        // try {

        //     ev.action.setFeedbackLayout('$A0');
        //     ev.action.setFeedback({
        //         title: 'Layout $A0',
        //         'full-canvas': { background: 'blue' },
        //         canvas: { background: '#FFFFFF' },
        //     });
    
        //     streamDeck.logger.info("Dynamic image displayed on Layout A0 canvas using 'full-canvas'");
        // } catch (error) {
        //     console.error("Failed to display pixmap on Layout A0 canvas:", error);
        //     await ev.action.setFeedback({ title: "Error" }); // Optional fallback
        // }

        
        try {
            // Loop from 0 to 10
            for (let counter = 0; counter <= 10; counter++) {
                // Generate the image dynamically based on the current counter value
                const { data: rawImageData } = await this.generateDynamicImage(counter);
        
                // Convert the raw image data to a data URL (Base64-encoded RGBA)
                //const base64Image = `data:image/png;base64,${rawImageData.toString("base64")}`;

                // Fixed test image
                const base64Image = `data:image/png;base64,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`;

       
                // Set the layout and feedback payload
                ev.action.setFeedbackLayout("$A0");
                await ev.action.setFeedback({
                    //title: `Count: ${counter}`, // Optional title for context
                    title: '',
                    'full-canvas': base64Image // 'canvas' or 'full-canvas' in A0 layout
                });
        
                streamDeck.logger.info(`Dynamic image displayed with counter: ${counter}`);
        
                // Pause for a short time to simulate animation (e.g., 500ms)
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        } catch (error) {
            console.error("Failed to display the image on the canvas:", error);
            ev.action.setFeedback({ title: "Error displaying image" });
        }


    }
    
    
    

    /**
     * Dynamically generates an image based on the current state (e.g., dial ticks).
     */
    private async generateDynamicImage(ticks: number): Promise<{ data: Buffer; info: sharp.OutputInfo }> {
        const text = `Count: ${ticks}`;
        streamDeck.logger.info(`Generating image with text: ${text}`);
       
        
        return await sharp({
            create: {
                width: 200, // Canvas rect width (match Layout A0) // 136
                height: 100, // Canvas rect height (match Layout A0) // 72
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            }
        })
            .composite([
                {
                    input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100">
                        <style><![CDATA[
                            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap');
                            text {
                                font-family: 'Roboto', sans-serif;
                            }
                        ]]></style>
                        <text x="10" y="30" font-size="20" fill="black" font-weight="bold">${text}</text>
                    </svg>`),
                    gravity: "center"
                    
                }
            ])
            .png() // Output as PNG
            .toBuffer({ resolveWithObject: true });
    }
    
    




    /**
     * Reads the content of the text file.
     */
    private readFileContent(): string {
        streamDeck.logger.info("Attempting to read file content from:", this.filePath);
        if (!fs.existsSync(this.filePath)) {
            streamDeck.logger.error("File not found:", this.filePath);
            throw new Error(`File not found: ${this.filePath}`);
        }
        const content = fs.readFileSync(this.filePath, "utf-8").trim();
        streamDeck.logger.info("File content read:", content);
        return content;
    }
}

/**
 * Settings for {@link TextFileDisplayAction}.
 */
type TextFileSettings = {
    // Future expansion for customizable settings.
};
