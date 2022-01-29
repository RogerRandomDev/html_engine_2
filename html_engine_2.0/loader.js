
function make_object(data){
    let color = new Color(data.col.r,data.col.g,data.col.b)
    let position = V2(data.pos.x,data.pos.y)
    let rotation = data.rot
    let points_base = data.pts
    let points = []
    for(const point of points_base){points.push(V2(point.x,point.y))}
    let bounce = data.bnc
    let friction = data.frc
    let damp = data.dmp
    let type = data.type
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
    }
}

function load_scene(scene_data){
    for(const object of scene_data){make_object(object)}
}