gamerule maxCommandChainLength 10000000
tellraw @s {"text": "*Scanning world..."}
execute as @s[nbt={Dimension:1}] run tellraw @s {"text": "*Dimension: End"}
execute as @s[nbt={Dimension:0}] run tellraw @s {"text": "*Dimension: Overworld"}
execute as @s[nbt={Dimension:-1}] run tellraw @s {"text": "*Dimension: Nether"}
kill @e[type=armor_stand,tag=find]
summon armor_stand ~ 0 ~ {Tags:["find"],NoGravity:1b}
execute store result score x_start scanner run data get entity @s Pos[0] 1
execute store result score z_start scanner run data get entity @s Pos[2] 1
execute store result entity @e[type=armor_stand,tag=find,limit=1] Pos[0] double 1 run scoreboard players get x_start scanner
execute store result entity @e[type=armor_stand,tag=find,limit=1] Pos[2] double 1 run scoreboard players get z_start scanner
scoreboard players operation pos_x scanner = x_start scanner
scoreboard players set x scanner 0
scoreboard players set y scanner 0
scoreboard players set z scanner 0
forceload add ~ ~ ~ ~1000
execute at @e[type=armor_stand,tag=find] run function scripts:find/loop