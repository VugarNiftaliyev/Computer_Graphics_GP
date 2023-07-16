let gl, program;
let modelViewMatrix;
let points = [];
let colors = [];

let eye = [0, 0, 0.1];
let at = [0, 0, 0];
let up = [0, 1, 0];

let sun, planet1, planet2, planet3;

// initial camera position
let cameraPosition = vec3(0, 0, 1); 
// initial camera rotation angle
let cameraRotation = 0;
// camera rotation speed 
let rotationSpeed = 0.5; 
// camera zoom speed
let zoomSpeed = 0.1; 

let lightPosition = vec3(1.0, 1.0, 1.0); // Light position

let lightAmbient = vec3(0.2, 0.2, 0.2); // Ambient light color
let lightDiffuse = vec3(1.0, 1.0, 1.0); // Diffuse light color
let lightSpecular = vec3(1.0, 1.0, 1.0); // Specular light color


onload = () => {
  let canvas = document.getElementById("webgl-canvas");
  window.addEventListener("keydown", handleKeyDown);

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("No webgl for you");
    return;
  }

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);
    // Set the values of the lighting uniforms
    let lightPositionUniform = gl.getUniformLocation(program, "lightPosition");
    gl.uniform3fv(lightPositionUniform, flatten(lightPosition));

    let lightAmbientUniform = gl.getUniformLocation(program, "lightAmbient");
    gl.uniform3fv(lightAmbientUniform, flatten(lightAmbient));

    let lightDiffuseUniform = gl.getUniformLocation(program, "lightDiffuse");
    gl.uniform3fv(lightDiffuseUniform, flatten(lightDiffuse));

    let lightSpecularUniform = gl.getUniformLocation(program, "lightSpecular");
    gl.uniform3fv(lightSpecularUniform, flatten(lightSpecular));

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
let theta = 0.0;
let left = -2.0;
let right = 2.0;
let bottom = -2.0;
let ytop = 2.0;
let near = -100.0;
let far = 100.0;

function handleKeyDown(event) {
    switch (event.key) {
      // Move camera up
      case "ArrowUp": 
        eye[1] -= 0.1;
        at[1] -= 0.1;
        break;
        // Move camera down
      case "ArrowDown": 
        eye[1] += 0.1;
        at[1] += 0.1;
        break;
        // Move camera left
      case "ArrowLeft": 
        eye[0] += 0.1;
        at[0] += 0.1;
        break;
        // Move camera right
      case "ArrowRight": 
        eye[0] -= 0.1;
        at[0] -= 0.1;
        break;
      case "D":
      case "d":
          // rotating the camera clockwise
          theta = 0.1;
          rotating_camera(theta);
          break;
      case "A":
      case "a":
          // rotating the camera counter-clockwise
          theta = -0.1;
          rotating_camera(theta);
          break;
      case "W":
          case "w":
          // zoom in camera
          left += 0.1;
          right -= 0.1;
          bottom += 0.1;
          ytop -= 0.1;
          break;
      case "S":
          case "s":
          // zoom out camera
          left -= 0.1;
          right += 0.1;
          bottom -= 0.1;
          ytop += 0.1;
          break;
    }
  }
  function rotating_camera(theta) {
    // defining rotation matrices for each view orientation
    // top-side view; rotation matrix around the Y-axis in the X-Z plane
    const top_view_rotation_matrix = [
      [Math.cos(theta), 0, Math.sin(theta)],
      [0, 1, 0],
      [-Math.sin(theta), 0, Math.cos(theta)]
    ];
  
      // left-side view; rotation matrix around the X-axis in the Y-Z plane
    const left_view_rotation_matrix = [
      [1, 0, 0],
      [0, Math.cos(theta), Math.sin(theta)],
      [0, -Math.sin(theta), Math.cos(theta)]
    ];
  
     // front-side view; rotation matrix around the Z-axis in the X-Y plane 
    const front_view_rotation_matrix = [
      [Math.cos(theta), -Math.sin(theta), 0],
      [Math.sin(theta), Math.cos(theta), 0],
      [0, 0, 1]
    ];
  
    // creating a  function to multiply a rotation matrix with the up vector
    function multiplyMatrixWithVector(matrix, vector) {
      const result = [0, 0, 0];
  
      // matrix-vector multiplication
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          result[i] += matrix[i][j] * vector[j];
        }
      }
  
      return result;
    }
  
    // checking  position of the camera and applying the corresponding rotation
    // in the top-side view of the camera
    if (eye[0] === 0 && eye[1] === 1 && eye[2] === 0) {
      up = multiplyMatrixWithVector(top_view_rotation_matrix, up);
    }
    // in the left-side view of the camera
    else if (eye[0] === -1 && eye[1] === 0 && eye[2] === 0) {
      up = multiplyMatrixWithVector(left_view_rotation_matrix, up);
    }
    // in the front-side view of camera
    else {
      up = multiplyMatrixWithVector(front_view_rotation_matrix, up);
    }
  }
  


  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    let time = Date.now() * 0.001; 
  
    // Planet 1 orbit
    let radius1 = 0.8;
    let speed1 = 0.3;
    let planet1X = radius1 * Math.cos(speed1 * time);
    let planet1Z = radius1 * Math.sin(speed1 * time);
  
    // Planet 2 orbit
    let radius2 = 0.5;
    let speed2 = 0.5;
    let planet2X = radius2 * Math.cos(speed2 * time);
    let planet2Z = radius2 * Math.sin(speed2 * time);
  
    // Planet 3 orbit
    let radius3 = 0.3;
    let speed3 = 0.3;
    let planet3X = radius3 * Math.cos(speed3 * time);
    let planet3Z = radius3 * Math.sin(speed3 * time);
  
    // Add vertices and colors for the updated planet positions
    points = [];
    colors = [];
  
    // Add vertices and colors for the sun
    let sunVertices = sun.TriangleVertices;
    let sunColor = vec3(1.0, 0.5, 0.0); // Orange color for nucleus (sun)
    for (let i = 0; i < sunVertices.length; i++) {
      points.push(sunVertices[i]);
      colors.push(sunColor);
    }
// Blue sphere: Mostly specular (shiny)
let planetColor1 = vec3(0.0, 0.0, 1.0);

// Green sphere: Mostly diffuse
let planetColor2 = vec3(0.0, 1.0, 0.0);

// Brown sphere: Mostly translucent
let planetColor3 = vec3(0.5, 0.25, 0.0);

  
    let planet1Vertices = sphere().TriangleVertices;
    // Rotate planet1 vertices around Y-axis 
    applyRotation(planet1Vertices, 0.5 * time); 
    let planet2Vertices = sphere().TriangleVertices; 
    // Rotate planet2 vertices around Y-axis
    applyRotation(planet2Vertices, time); 
    let planet3Vertices = sphere().TriangleVertices;
    // Rotate planet3 vertices around Y-axis 
    applyRotation(planet3Vertices, 1.5 * time); 
  
    for (let i = 0; i < planet1Vertices.length; i++) {
      points.push([
        planet1Vertices[i][0] * 0.15 + planet1X,
        planet1Vertices[i][1] * 0.15,
        planet1Vertices[i][2] * 0.15 + planet1Z,
        1.0,
      ]);
      colors.push(planetColor1);
    }
    for (let i = 0; i < planet2Vertices.length; i++) {
      points.push([
        planet2Vertices[i][0] * 0.1 + planet2X,
        planet2Vertices[i][1] * 0.1,
        planet2Vertices[i][2] * 0.1 + planet2Z,
        1.0,
      ]);
      colors.push(planetColor2);
    }
    for (let i = 0; i < planet3Vertices.length; i++) {
      points.push([
        planet3Vertices[i][0] * 0.08 + planet3X,
        planet3Vertices[i][1] * 0.08,
        planet3Vertices[i][2] * 0.08 + planet3Z,
        1.0,
      ]);
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
    let projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    let combined_matrix = mult(projectionMatrix, mvm);
    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(combined_matrix));
  
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
  
    requestAnimationFrame(render);
  }
  
  function applyRotation(vertices, angle) {
    const cosTheta = Math.cos(angle);
    const sinTheta = Math.sin(angle);
    for (let i = 0; i < vertices.length; i++) {
      const x = vertices[i][0];
      const z = vertices[i][2];
      vertices[i][0] = x * cosTheta + z * sinTheta;
      vertices[i][2] = -x * sinTheta + z * cosTheta;
    }
  }