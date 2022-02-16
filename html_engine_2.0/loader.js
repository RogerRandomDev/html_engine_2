
function make_object(data){
    let color = new Color(data.col.r,data.col.g,data.col.b)
    let position = V2(data.pos.x,data.pos.y)
    let rotation = data.rot/180*Math.PI
    let points_base = data.pts
    let points = []
    for(const point of points_base){points.push(V2(point.x,point.y))}
    let bounce = data.bnc
    let friction = data.frc
    let damp = data.dmp
    let type = data.type
    let fontSize = data.fS
    let text = data.txt
    let obj = null;
    switch(type){
        case("Polygon"):
            obj = new Polygon(points,position,color,rotation)
            return obj;break
        case("PhysicsObject"):
            obj = new PhysicsObject(points,position,color)
            obj.friction=friction;obj.bounce=bounce;obj.damp=damp;obj.rotation=rotation
            return obj;break
        case("PlayerObject"):
            obj = new PlayerObject(points,position,color)
            obj.friction=friction;obj.bounce=bounce;obj.damp=damp;obj.rotation=rotation
            return obj;break
        case("Text"):
            obj = new Text(fontSize,position,color,rotation)
            obj.text=text;obj.update_text()
            return obj;break
        case("jumpPad"):
            obj = new jumpPad(points,position,color)
            return obj;break
    }
}
function new_object(type){
    switch(type){
        case("Polygon"):
            obj = new Polygon()
            return obj;break
        case("PhysicsObject"):
            obj = new PhysicsObject()
            return obj;break
        case("PlayerObject"):
            obj = new PlayerObject()
            return obj;break
        case("Text"):
            obj = new Text()
            obj.text="Insert Text";obj.update_text()
            return obj;break
        case("jumpPad"):
            obj = new jumpPad()
            return obj;break
    }
}
function load_scene(scene_data){
    for(const object of scene_data){make_object(object)}
}
function empty_scene(){
    for(const object of render_objects){object.remove_from_scene()}
    for(const object of update_objects){object.remove_from_scene()}
    for(const object of collision_objects){object.remove_from_scene()}
}

function duplicate(obj){
    let n_obj = make_object(obj.get_data())
}