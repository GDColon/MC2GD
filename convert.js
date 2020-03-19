const fs = require('fs')
const zlib = require('zlib')
const blocks = require('./blocks.json')
const leveldata = require('./leveldata.json')
const colors = require('./colors.json')
const settings = fs.readFileSync('./settings.txt', 'utf8').split("\n").filter(x => x.startsWith(">")).map(x => x.slice(2))

let [gdLevels, logFile, yOffset] = settings
gdLevels = gdLevels.replace("HOME", process.env.HOME || process.env.USERPROFILE).replace(/\\/g,"/").replace("\r", "")
logFile = logFile.replace("HOME", process.env.HOME || process.env.USERPROFILE).replace(/\\/g,"/").replace("\r", "")

console.log()   // Blank line for neatness
if (process.platform == "darwin") return console.log("Unfortunately, MC2GD currently does not work on Mac. (GD save files are encrypted differently).\nI'll try my best to get it working in the future!\n")

let missing = []
let specialColors = {}

function parseHSV(val) {
    let [h, s, v] = val.split(",")
    s = s ? s/100 : 0
    v = v ? v/100 : 0
    return `${h}a${s}a${v}a1a1`
}

function missingList(block) {
    if (!missing.includes(block) && block != "Air") missing.push(block)
}

function xor(str, key) {
    str = String(str).split('').map(letter => letter.charCodeAt());
    let res = "";
    for (i = 0; i < str.length; i++) res += String.fromCodePoint(str[i] ^ key);
    return res;
}

// Auto color wood and dye blocks
// I wasn't able to directly edit the 'blocks' object without issues so I had to make a new one called 'specialColors'
Object.keys(colors).forEach(blockType => {
    let blockStr = `[${blockType}]`
    Object.keys(colors[blockType]).forEach(c => {
        Object.keys(blocks).filter(x => x.includes(blockStr)).forEach(x => {
            let blockname = x.replace(blockStr, c)
            specialColors[blockname] = []
            blocks[blockname] = []
            let b = blocks[x]
            let coloredBlock = !Array.isArray(b) ? [b] : b
            coloredBlock.forEach((block, i) => {
                let blockcol = colors[blockType][c].split(",").map(x => +x)
                let colorshift = block['shift']
                if (colorshift) {
                    colorshift = colorshift.split(",")
                    for (let n = 0; n < 3; n++) blockcol[n] += +colorshift[n]
                }
                blocks[blockname][i] = block
                specialColors[blockname][i] = blockcol
            })
        })
    })
})

fs.readFile(logFile, 'utf8', function(err, data) {

    if (err) return console.log("Error! Could not open or find Minecraft log file: " + logFile + "\nMaybe double check that you entered the correct file path into settings.txt?\n")

    console.log("> Parsing log...")
    let logError = "Error! Could not parse Minecraft log file!\nDid you run the function in your most recent session?\n"

    data = data.replace(/\r/g, "")
    if (!data.match(/: \[CHAT\] \*Scanning world\.\.\.\n\[/)) return console.log(logError)
    if (!data.match(/: \[CHAT\] \[Server\] Done\n\[/)) return console.log("Error! Did you wait for the function to finish?\n")
    else data = data.split(": [CHAT] *Scanning world...\n")

    let worldName = data.join().match(/Saving chunks for level '(.+)\/minecraft:/g)
    if (!worldName) return console.log("Error! Did you save the world before quitting?")
    worldName = worldName[worldName.length-1].slice(25, -12)
    data = data[1].split(": [CHAT] [Server] Done\n")[0]
    let dimension = data.match(/\*Dimension: (.+)\n/)[1]

    let list = data.split("\n")
    .map(x => x.replace(/\[.+\] \[.+\]: /g, ""))
    .map(x => x.match(/\[CHAT\] (.+) at (-?\d+), (-?\d+), (-?\d+)/))
    .filter(x => !!x)
    .map(x => ({block: x[1], x: x[2], y: x[3], z: x[4]}))
    .sort(function(a, b){return a.z-b.z})

    list = list.filter(x => x.x == list[0].x)
    if (!list.length) return console.log(logError)
    let firstZ = +list[0].z

    let levelStr = ""
    let objects = 0

    console.log("> Building level...")
    
    list.forEach(x => {
        let data = blocks[x.block]
        if (!data) return missingList(x.block)
        if (!Array.isArray(data)) data = [data]
        data.forEach((y, i) => {
            if (y.id == 9999999) return missingList(x.block)
            if (Object.keys(specialColors).includes(x.block)) y.c = [specialColors[x.block][i].join(","), `${specialColors[x.block][i][0]},${specialColors[x.block][i][1]-10},${specialColors[x.block][i][2]}`]
            let pos = [((+x.z + 1 - firstZ) * 30) - 15, ((+x.y + 1) * 30) - 15 + (+yOffset*30)]
            if (y.x) pos[0] += y.x              // X Offset
            if (y.y) pos[1] += y.y              // Y Offset
            levelStr += `1,${y.id},2,${pos[0]},3,${pos[1]},57,1`
            if (y.r) levelStr += `,6,${y.r}`    // Rotation
            if (y.flipX) levelStr += `,4,1`    // Flip X
            if (y.flipY) levelStr += `,5,1`    // Flip Y
            if (y.z) levelStr += `,24,${y.z}`   // Z Layer
            if (y.s) levelStr += `,32,${y.s}`   // Scale
            if (y.c) {                          // Color (HSV)
                if (!Array.isArray(y.c)) levelStr += `,21,10,23,10,41,1,43,${parseHSV(y.c)}`
                else levelStr += `,21,10,22,10,23,10,41,1,42,1,43,${parseHSV(y.c[0])},44,${parseHSV(y.c[1])}`
            }
            levelStr += ";"
            objects += 1
        })
    })

    fs.readFile(gdLevels, 'utf8', function(err, saveData) {

        if (err) return console.log("Error! Could not open or find GD save file: " + gdLevels + "\nMaybe double check that you entered the correct file path into settings.txt?\n")

        if (!saveData.startsWith('<?xml version="1.0"?>')) {
            console.log("> Decrypting GD save file...")
            saveData = xor(saveData, 11)
            saveData = Buffer.from(saveData, 'base64')
            try { saveData = zlib.unzipSync(saveData).toString() }
            catch(e) { return console.log("Error! GD save file seems to be corrupt!\nMaybe try saving a GD level in-game to refresh it?\n") }
        }
        
        console.log("> Importing to GD...")
        let desc =`Imported from ${dimension == "Overworld" ? "" : dimension + " of "}a Minecraft world. X ${list[0].x}, Z ${firstZ} to ${firstZ+1000}`
        saveData = saveData.split("<k>_isArr</k><t />")
        saveData[1] = saveData[1].replace(/<k>k_(\d+)<\/k><d><k>kCEK<\/k>/g, function(n) { return "<k>k_" + (Number(n.slice(5).split("<")[0])+1) + "</k><d><k>kCEK</k>" })
        saveData = saveData[0] + "<k>_isArr</k><t />" + leveldata.ham + leveldata.bur + levelStr + leveldata.ger + saveData[1]
        saveData = saveData.replace("[[LEVELNAME]]", worldName).replace("[[LEVELDESC]]", desc).replace("[[BGCOL]]", leveldata.backgrounds[dimension])
        
        fs.writeFileSync(gdLevels, saveData, 'utf8')
        console.log(`Saved level with ${objects} objects!`);
        if (missing.length) console.log(`Could not add objects for: ${missing.sort().join(", ")}`)
        console.log()
    })

});