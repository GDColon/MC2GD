# Initiate stuff
scoreboard objectives add scanner dummy
gamerule maxCommandChainLength 10000020
gamerule maxCommandChainLength 1000000020

# Output header
tellraw @s [{"text": "*Scanning world..."}]
execute as @s[nbt={Dimension:1}] run tellraw @s [{"text": "*Dimension: End"}]
execute as @s[nbt={Dimension:0}] run tellraw @s [{"text": "*Dimension: Overworld"}]
execute as @s[nbt={Dimension:-1}] run tellraw @s [{"text": "*Dimension: Nether"}]

# Store position (and other related things)
execute store result score x scanner run data get entity @s Pos[0]
scoreboard players set y scanner 0
execute store result score z scanner run data get entity @s Pos[2]
scoreboard players operation start_z scanner = z scanner
scoreboard players operation z_offset scanner = z scanner
scoreboard players add z_offset scanner 1001

# Setup final things and start the loop
forceload add ~ ~ ~ ~1000
tag @e[type=item] add mc2gd.item
execute align xyz positioned ~.5 0 ~.5 run function scripts:find/loop-y

# Output footer
tellraw @s [{"text": "[Server] Done"}]

# Remove leftover things - so the world is as it was before
kill @e[type=minecraft:item,tag=!mc2gd.item]
tag @e[type=item] remove mc2gd.item
forceload remove ~ ~ ~ ~1000
scoreboard objectives remove scanner