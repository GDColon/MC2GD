# MC2GD Guide

Skip to the bottom for ultra-short instructions if you just want me to shut up and get to the point.

## Step 1 - Install Node

MC2GD was made in node.js, and Node isn't exactly meant to be compiled into an exe. I mean, it's possible - but it would be like 50 megabytes because of all the dependencies it needs. So you might as well just install Node. I know, I know. I'm the worst dev ever.

[Download node.js here](https://nodejs.org/en/download/)

If you installed it correctly, it should say "Welcome to Node.js" when you type `node` into CMD/PowerShell instead of an error message.

## Step 2 - Add the Datapack

For the sake of the guide, I'm just going to assume you don't know how to add a datapack. Choose (or create) a Minecraft world **(1.15 or newer is required!)** and open the world folder. You can do this by clicking the world, pressing 'edit', then pressing 'open world folder'. Now open the datapacks folder and drag in the 'Scanner Datapack' folder.

## Step 3 - Run the Datapack

...and watch your PC burn into flames.

Just kidding, you'll be fine. Go into your Minecraft world (or type `/reload` if you're already in), and find a spot in the world that looks neat. **The datapack will scan 1000 blocks south of the block you're standing on**. This means that if you're standing at `X: 100, Z: 50`, it will scan every block with an X position of 100 and a Z position between 50 and 1050. You can see the direction you're facing on the F3 menu.

Once you're all set, type `/function scripts:find` into chat and watch as the datapack absolutely obliterates your chat, and if you have a less fortunate computer, your CPU. An armor stand is scanning every single block and saying its name in the chat.

Once (and only when) you get a message saying "Done", you can save and quit off the world, close Minecraft, and...

## Step 4 - Run the Program

Provided you have Node, Geometry Dash, and Minecraft installed normally, this is the easiest step. Simply run the `MC2GD.bat` file and if everything goes well, the program would have read your most recent Minecraft log file, and built a GD level using all the blocks mentioned in the chat. Any blocks that weren't able to be built in GD will be mentioned in the program. (Rare and less natural blocks will most likely not appear. Keep in mind that I had to manually construct a GD version of each Minecraft block!)

If something goes wrong, on the other hand, the error message will most likely say what happened. If your Minecraft or GD data is stored somewhere unusual, you can change the GD save file location and the Minecraft log file location in `settings.txt` so the program knows where to look.

When you open Geometry Dash, the generated level should appear at the top of your created levels list. It's no fun to play because there's no hitboxes, but looking around in the editor is sweet. Note that a Minecraft world is 256 blocks high and a GD level is only 100 - so some tall parts of the world might go up and off the screen. All the objects in the level are on group 1, so you can temporarily shift everything down by placing a move trigger and playtesting the level from the editor.

## TL;DR

1.  [Install node.js](https://nodejs.org/en/download/) if you don't already have it. (type `node` in CMD/PowerShell to check)

2. Open or create a Minecraft world **(version 1.15+)** and add the "Scanner Datapack" folder to the world's datapack folder. Type `/reload` if you're currently logged into the world.

3. Find a cool spot in the world and type `/function scripts:find`. The datapack will scan all the way up to **1000 blocks south** of your current position. The X position will remain constant.

4. Once a message saying "done" appears, save and quit off the world, close Minecraft and run `MC2GD.bat`

5. Open Geometry Dash. If everything goes correctly, your Minecraft world should appear as your first created level!

6. View the world by looking around in the editor. Use a move trigger on group 1 if tall parts of the world go off the screen.
