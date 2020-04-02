# Output for common blocks
execute if block ~ ~ ~ #scripts:common run function scripts:find/common

# Output for special blocks
execute if block ~ ~ ~ #scripts:special run function scripts:find/special

# Output for non-special, implemented blocks
execute unless block ~ ~ ~ #scripts:null unless block ~ ~ ~ #scripts:common unless block ~ ~ ~ #scripts:special run function scripts:find/get

# Increment Z and loop at that Z pos if Y<=start Y + 1001
scoreboard players add z scanner 1
execute if score z scanner < z_offset scanner positioned ~ ~ ~1 run function scripts:find/loop-z