scoreboard players set z scanner 0
function scripts:find/loop_z
scoreboard players add y scanner 1
execute if score y scanner matches ..255 run schedule function scripts:find/loop 1t
execute if score y scanner matches 256 run function scripts:find/done