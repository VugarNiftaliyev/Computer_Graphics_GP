let gl, program;
let modelViewMatrix;
let points = [];
let colors = [];

let eye = [0, 0, 0.1];
let at = [0, 0, 0];
let up = [0, 1, 0];



let sun, planet1, planet2, planet3;


onload = () => {
  let canvas = document.getElementById("webgl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("No webgl for you");
    return;
  }

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.DEPTH_TEST);

  gl.clearColor(0, 0, 0, 0.5);

  sun = sphere();
  sun.scale(0.2, 0.2, 0.2);
  sun.translate(0, 0, 0);

  planet1 = sphere();
  planet1.scale(0.15, 0.15, 0.15);
  planet1.translate(-0.8, 0, 0);

  planet2 = sphere();
  planet2.scale(0.1, 0.1, 0.1);
  planet2.translate(-0.5, 0, 0);

  planet3 = sphere();
  planet3.scale(0.08, 0.08, 0.08);
  planet3.translate(-0.3, 0, 0);


  let vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  let vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  let cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  let vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");

  render();
};
  


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    let time = Date.now() * 0.001; 
  
    // Planet 1 orbit
    let radius1 = 0.8;
    let speed1 = 0.4;
    let planet1X = radius1 * Math.cos(speed1 * time);
    let planet1Z = radius1 * Math.sin(speed1 * time);
    planet1 = sphere(); 
    planet1.scale(0.15, 0.15, 0.15);
    planet1.translate(planet1X, 0, planet1Z);
  
    // Planet 2 orbit
    let radius2 = 0.5;
    let speed2 = 0.6;
    let planet2X = radius2 * Math.cos(speed2 * time);
    let planet2Z = radius2 * Math.sin(speed2 * time);
    planet2 = sphere(); 
    planet2.scale(0.1, 0.1, 0.1);
    planet2.translate(planet2X, 0, planet2Z);
  
    // Planet 3 orbit
    let radius3 = 0.3;
    let speed3 = 0.8;
    let planet3X = radius3 * Math.cos(speed3 * time);
    let planet3Z = radius3 * Math.sin(speed3 * time);
    planet3 = sphere(); 
    planet3.scale(0.08, 0.08, 0.08);
    planet3.translate(planet3X, 0, planet3Z);
  
    // Add vertices and colors for the updated planet positions
    points = [];
    colors = [];
  
    // Add vertices and colors for the sun
    let sunVertices = sun.TriangleVertices;
    // Orange color for nucleus (sun)
    let sunColor = vec3(1.0, 0.5, 0.0); 
    for (let i = 0; i < sunVertices.length; i++) {
      points.push(sunVertices[i]);
      colors.push(sunColor);
    }
     // Blue for planet1
    let planetColor1 = vec3(0.2, 0.2, 1.0);
    // Green for planet2 
    let planetColor2 = vec3(0.0, 0.6, 0.0); 
    // Brown for planet3
    let planetColor3 = vec3(0.6, 0.4, 0.2); 
    // Add vertices and colors for the planets
    let planetVertices1 = planet1.TriangleVertices;
    let planetVertices2 = planet2.TriangleVertices;
    let planetVertices3 = planet3.TriangleVertices;
    for (let i = 0; i < planetVertices1.length; i++) {
      points.push(planetVertices1[i]);
      colors.push(planetColor1);
    }
    for (let i = 0; i < planetVertices2.length; i++) {
      points.push(planetVertices2[i]);
      colors.push(planetColor2);
    }
    for (let i = 0; i < planetVertices3.length; i++) {
      points.push(planetVertices3[i]);
      colors.push(planetColor3);
    }
  
  
    let vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
  
    let vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
  
    let cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
  
    let vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
  
    let mvm = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(mvm));
  
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
  
    requestAnimationFrame(render);
  }
  


  
  
  

  
  

  


