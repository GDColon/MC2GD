scoreboard players operation pos_y scanner = y scanner
scoreboard players operation pos_z scanner = z_start scanner
scoreboard players operation pos_z scanner += z scanner
execute store result entity @e[type=armor_stand,tag=find,limit=1] Pos[1] double 1 run scoreboard players get pos_y scanner
execute store result entity @e[type=armor_stand,tag=find,limit=1] Pos[2] double 1 run scoreboard players get pos_z scanner
kill @e[type=item]
execute at @e[type=armor_stand,tag=find] run loot spawn ~ ~ ~ mine ~ ~ ~ shears{Enchantments:[{id:"silk_touch",lvl:1}]}
execute unless entity @e[type=item,limit=1] at @e[type=armor_stand,tag=find] run loot spawn ~ ~ ~ mine ~ ~ ~ diamond_pickaxe{Enchantments:[{id:"silk_touch",lvl:1}]}
execute if entity @e[type=item,limit=1] run tellraw @a [{"selector":"@e[type=item,limit=1]"},{"text":" at "},{"score":{"name":"pos_x","objective":"scanner"}},{"text":", "},{"score":{"name":"pos_y","objective":"scanner"}},{"text":", "},{"score":{"name":"pos_z","objective":"scanner"}}]
execute unless entity @e[type=item,limit=1] at @e[type=armor_stand,tag=find] run function scripts:find/special
kill @e[type=item]