// WebGL - 2D Geometry Translate Better
// from https://webglfundamentals.org/webgl/webgl-2d-geometry-translate-better.html

"use strict";

function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // setup GLSL program
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
    gl.useProgram(program);

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");

    // lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var translationLocation = gl.getUniformLocation(program, "u_translation");

    // Create a buffer to put positions in
    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Put geometry data into buffer
    setGeometry(gl);

    var translation = [0, 0];
    var color = [Math.random(), Math.random(), Math.random(), 1];

    drawScene();

    // Setup a ui.
    webglLessonsUI.setupSlider("#x", { slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y", { slide: updatePosition(1), max: gl.canvas.height });

    function updatePosition(index) {
        return function (event, ui) {
            translation[index] = ui.value;
            drawScene();
        };
    }

    // Draw the scene.
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas.
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Turn on the attribute
        gl.enableVertexAttribArray(positionLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionLocation, size, type, normalize, stride, offset);

        // set the resolution
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        // set the color
        gl.uniform4fv(colorLocation, color);

        // Set the translation.
        gl.uniform2fv(translationLocation, translation);

        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 18;  // 6 triangles in the 'F', 3 points per triangle
        //gl.drawArrays(primitiveType, offset, count);

        //AB-delete it
        let colors = [ [Math.random(), Math.random(), Math.random(), 1],
        [Math.random(), Math.random(), Math.random(), 1],
        [Math.random(), Math.random(), Math.random(), 1],
        ]
        // Draw each triangle separately
        for (let start = 0, color_index = 0; start < 18; start += 6, color_index += 1) {
            // Set the color of the triangle
            gl.uniform4fv(colorLocation, colors[color_index]);

            // Draw a single triangle
            gl.drawArrays(primitiveType, start, 6);

        }

    }
}

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // left column
            0, 0,
            10, 0,
            0, 10,
            0, 10,
            10, 0,
            10, 10,


            0, 10,
            10, 10,
            0, 20,
            0, 20,
            10, 10,
            10, 20,

            0, 20,
            10, 20,
            0, 30,
            0, 30,
            10, 20,
            10, 30,

            // // top rung
            // 30, 0,
            // 60, 0,
            // 30, 150,
            // 30, 150,
            // 60, 0,
            // 60, 150,

            //  // top rung
            //  0, 0,
            //  90, 0,
            //  0, 150,
            //  0, 150,
            //  90, 0,
            //  90, 150,
            
        ]),
        gl.STATIC_DRAW);
}

main();
