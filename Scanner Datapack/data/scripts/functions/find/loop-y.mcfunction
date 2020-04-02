# Set Z pos
scoreboard players operation z scanner = start_z scanner

# Start Z loop
function scripts:find/loop-z

# Increment Y and loop at that Y pos if Y<=256
scoreboard players add y scanner 1
execute if score y scanner matches ..255 positioned ~ ~1 ~ run function scripts:find/loop-y