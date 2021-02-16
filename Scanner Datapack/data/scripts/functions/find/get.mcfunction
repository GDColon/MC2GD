# Try spawning current block as item
execute store result score itemcount scanner run loot spawn ~ ~ ~ mine ~ ~ ~ shears{Enchantments:[{id:"silk_touch",lvl:1}]}
execute unless score itemcount scanner matches 1.. store result score itemcount scanner run loot spawn ~ ~ ~ mine ~ ~ ~ diamond_pickaxe{Enchantments:[{id:"silk_touch",lvl:1}]}

# Output item name if item exists
execute if entity @e[type=minecraft:item,tag=!mc2gd.item,distance=..1,sort=nearest,limit=1] run tellraw @s [{"selector":"@e[type=minecraft:item,tag=!mc2gd.item,distance=..1,sort=nearest,limit=1]"},{"text":" at "},{"score":{"name":"x","objective":"scanner"}},{"text":", "},{"score":{"name":"y","objective":"scanner"}},{"text":", "},{"score":{"name":"z","objective":"scanner"}}]

# Remove item entity
kill @e[type=minecraft:item,tag=!mc2gd.item,distance=..1,sort=nearest,limit=1]