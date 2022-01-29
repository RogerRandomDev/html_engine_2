let gravity = 256
let delta_time = 60
delta_time=1/delta_time
let do_update = true;
window.setInterval(function(){
    draw()
    if(!do_update){return}
    for(object of update_objects){object.update()}

},delta_time*1000)
let keys_pressed = []
document.addEventListener('mousedown',function(ev){
    let out = get_overlapping(V2(ev.pageX,ev.pageY))
    if(out!=null){console.log(out)}})
document.addEventListener('keydown',function(ev){if(!keys_pressed.includes(ev.key)){keys_pressed.push(ev.key)}})
document.addEventListener('keyup',function(ev){if(keys_pressed.includes(ev.key)){keys_pressed.splice(keys_pressed.indexOf(ev.key),1)}})

let scene_data = [
    {"type":"Polygon","pos":{"x":16,"y":256},"pts":[{"x":0,"y":0},{"x":1024,"y":0},{"x":1024,"y":32},{"x":0,"y":32}],"col":{"r":0,"g":0,"b":0},"rot":0.7853981633974483},{"type":"PlayerObject","pos":{"x":128,"y":335.94203387477313},"pts":[{"x":0,"y":0},{"x":32,"y":0},{"x":32,"y":32},{"x":0,"y":32}],"col":{"r":0,"g":0,"b":0},"rot":false,"bnc":0,"frc":0.5,"dmp":0.75}
]
load_scene(scene_data)
function get_scene_data(){
    let output = []
    for(const object of render_objects){output.push((object.get_data()))}
    console.log(JSON.stringify(output))}