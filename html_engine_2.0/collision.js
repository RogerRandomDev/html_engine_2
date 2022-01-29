let collision_objects=[]
function do_collision(obj){
    for(const object of collision_objects){
        if(object==obj){continue}
        let collision=Collide(obj.points,object.points,obj.position,object.position,object.rotation,obj.rotation)
        if(collision){return true}
    }
    return false
}
function get_overlapping(point=V2(0,0)){
    for(const object of render_objects){
        if(polyPoint(object.points,point.x-object.position.x,point.y-object.position.y,object.rotation)){return(object)}
    }
    return null
}

function Collide(p1,p2,p1off,p2off,p1rot,p2rot) {

  let next = 0;
  for (let current=0; current<p1.length; current++) {
    next = current+1;
    if (next == p1.length) next = 0;
    let vc = p1[current].rotated(p2rot).a(p1off);
    let vn = p1[next].rotated(p2rot).a(p1off);

    let collision = polyLine(p2, vc.x,vc.y,vn.x,vn.y,p2off,p2rot,p1rot);
    if (collision) return true;
    let p2point = p2[0].rotated(p2rot)
    collision = polyPoint(p1, p2point.x+p2off.x, p2point.y+p2off.y,p2rot,p1rot);
    if (collision) return true;
  }
  return false;
}
function polyLine(vertices,x1,y1,x2,y2,off2,p1rot,p2rot) {

  // go through each of the vertices, plus the next
  // vertex in the list
  let next = 0;
  for (let current=0; current<vertices.length; current++) {

    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current+1;
    if (next == vertices.length) next = 0;

    // get the lets at our current position
    // extract X/Y coordinates from each
    
    let vc = vertices[current].rotated(p2rot);
    let vn = vertices[next].rotated(p2rot);
    let x3 = vc.x+off2.x;
    let y3 = vc.y+off2.y;
    let x4 = vn.x+off2.x;
    let y4 = vn.y+off2.y;

    // do a Line/Line comparison
    // if true, return 'true' immediately and
    // stop testing (faster)
    let hit = lineLine(x1, y1, x2, y2, x3, y3, x4, y4);
    if (hit) {
      return true;
    }
  }

  // never got a hit
  return false;
}

// LINE/LINE
function lineLine( x1,  y1,  x2,  y2,  x3,  y3,  x4,  y4) {

  // calculate the direction of the lines
  let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return true;
  }
  return false;
}


// POLYGON/POINT
// used only to check if the second polygon is
// INSIDE the first
function polyPoint( vertices,px,py,rot1,rot2) {
  let collision = false;
  // go through each of the vertices, plus the next
  // vertex in the list
  let next = 0;
  for (let current=0; current<vertices.length; current++) {

    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current+1;
    if (next == vertices.length) next = 0;

    // get the lets at our current position
    // this makes our if statement a little cleaner
    let vc = vertices[current].rotated(rot1);    // c for "current"
    let vn = vertices[next].rotated(rot1);       // n for "next"
    // compare position, flip 'collision' variable
    // back and forth
    if (((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) &&
         (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)) {
            collision = !collision;
    }
  }
  return collision;
}