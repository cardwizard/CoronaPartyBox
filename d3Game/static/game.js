"use strict";

// svg element parameters
var svgWidth = 800;
var svgHeight = 800;

var wallLength = 800;
var wallThickness = 10;
var barLength = 100;
var barThickness = 10;

var ballRadius = 7;

// last user input timestamp
var time = Date.now();

// variables for svg objects
var svg;
var barGroup, renderedBars, ballGroup, renderedBall;
var barB, barR, barT, barL, ball;
var barElements, collisionElements, simulation;

// visual elements creation
svg = d3.select("#gameDiv").append("svg").attr("id", "gameSvg").attr("width", svgWidth).attr("height", svgHeight);

// initialize the game
setup();

// render the svg elements once
render();

function setup() {
    // json definitions of svg elements
    barB = {id: "barB", class: "pad", cx: svgWidth/2, cy: svgHeight-barThickness/2, length: barLength, thickness: barThickness};
    // for multiplayer, convert all the below walls to bars
    barR = {id: "barR", class: "wall", cx: svgWidth - wallThickness/2, cy: svgHeight/2, length: wallLength, thickness: wallThickness};
    barT = {id: "barT", class: "wall", cx: svgWidth/2, cy: wallThickness/2, length: wallLength, thickness: wallThickness};
    barL = {id: "barL", class: "wall", cx: wallThickness/2, cy: svgHeight/2, length: wallLength, thickness: wallThickness};

    // assign random initial velocity to the ball
    ball = {id: "ball", class: "ball", x: svgWidth/2, y: svgHeight/2, r: ballRadius, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10};

    // create a list of svg elements for adding to force field
    barElements = [barB, barR, barT, barL];
    collisionElements = barElements.concat([ball]);

    // Define the simulation field, set up the nodes and the forces in it
    simulation = d3.forceSimulation(collisionElements)
                    .force("collisionForce", reboundForce)
                    .on("tick", ticked)
                    .alphaDecay(0)   // no decay factor, let the simulation run till it is stopped explicitly
                    .velocityDecay(0)
                    .stop();

    // register key press listener
    d3.select("body").on("keydown", moveBar);
}

function reset() {
    // barB
    barB = barElements[0];
    barB.cx = svgWidth/2;
    barB.cy = svgHeight-barB.thickness/2;

    // barR
    barR = barElements[1];
    barR.cx = svgWidth - barR.thickness/2;
    barR.cy = svgHeight/2;

    // barT
    barT = barElements[2];
    barT.cx = svgWidth/2;
    barT.cy = barT.thickness/2;

    // barL
    barL = barElements[3];
    barL.cx = barL.thickness/2;
    barL.cy = svgHeight/2;

    ball.x = svgWidth/2;
    ball.y = svgHeight/2;
    ball.vx = (Math.random() - 0.5) * 10;
    ball.vy = (Math.random() - 0.5) * 10;

    // create a list of svg elements for adding to force field
    barElements = [barB, barR, barT, barL];
    collisionElements = barElements.concat([ball]);

    simulation.nodes(collisionElements);
}

function render() {
    // clear the old svg groups
    d3.select("#gameSvg").selectAll("g").remove();

    // render teh bars
    barGroup = d3.select("#gameSvg").append("g").attr("class", "bars").selectAll("rect").data(barElements);
    renderedBars = barGroup.enter()
                            .append("rect")
                            .attr("class", function (d) {return d.class})
                            .attr("id", function (d) {return d.id})
                            .attr("x", function (d) {
                                if (d.id == "barB" || d.id == "barT") {
                                    return d.cx - d.length/2;
                                }
                                else {
                                    return d.cx - d.thickness/2;
                                }
                            })
                            .attr("y", function(d) {
                                if (d.id == "barB" || d.id == "barT") {
                                    return d.cy - d.thickness/2;
                                }
                                else {
                                    return d.cy - d.length/2;
                                }
                            })
                            .attr("width", function (d) {
                                if (d.id == "barB" || d.id == "barT") {
                                    return d.length;
                                }
                                else {
                                    return d.thickness;
                                }
                            })
                            .attr("height", function (d) {
                                if (d.id == "barB" || d.id == "barT") {
                                    return d.thickness;
                                }
                                else {
                                    return d.length;
                                }
                            });

    // render the ball
    ballGroup = d3.select("#gameSvg").append("g").attr("class", "balls").selectAll("circle").data([ball]);
    renderedBall = ballGroup.enter()
                                .append("circle")
                                .attr("class", function (d) {return d.class})
                                .attr("id", function (d) {return d.id})
                                .attr("r", function (d) {return d.r})
                                .attr("cx", function(d) {return d.x})
                                .attr("cy", function(d) {return d.y});
}

function startGame() {
    simulation.alpha(1).restart();
}

function stopGame() {
    simulation.stop();
    reset();
}

function ticked() {
    // update ball position
    renderedBall.attr("cx", function(d) {return d.x;})
                .attr("cy", function(d) {return d.y;});

    // update the bar position here
    renderedBars.attr("x", function (d) {
                    if (d.id == "barB" || d.id == "barT") {
                        return d.cx - d.length/2;
                    }
                    else {
                        return d.cx - d.thickness/2;
                    }
                })
                .attr("y", function(d) {
                    if (d.id == "barB" || d.id == "barT") {
                        return d.cy - d.thickness/2;
                    }
                    else {
                        return d.cy - d.length/2;
                    }
                });
}

function moveBar() {
    var userInput = d3.event.keyCode;
    var moveStep = 5;

    if (Date.now() - time < 25 && moveStep < 50) {
        moveStep += 5;
        time = Date.now();
    }
    else {
        moveStep = 5;
    }

    // use the user input to set the bar position
    if ((userInput == 37) && (barElements[0].cx - 2 > barElements[0].length/2)) {
        // left arrow
        barElements[0].cx -= moveStep;
    }
    if ((userInput == 39) && (barElements[0].cx + 2 < svgWidth - barElements[0].length/2)) {
        // right arrow
        barElements[0].cx += moveStep;
    }
}

function reboundForce(alpha) {
    var bar;
    // check if the ball collides with any bar and 
    // rebound the ball if it does
    // or end the game if it is dropped

    // bottom bar
    bar = barElements[0];
    if (ball.y >= (bar.cy - bar.thickness/2 - ballRadius)) {
        // ball is below the ground
        if (ball.x >= (bar.cx - bar.length/2 - ballRadius) && ball.x <= (bar.cx + bar.length/2 + ballRadius)) {
            // ball is colliding with bottom bar, flip the y component of its velocity
            ball.vy *= -1;
        }
        else {
            // ball is not colliding with the bottom bar, ball is dropped, reset playground
            stopGame();
        }
    }

    // right bar
    bar = barElements[1];
    if (ball.x >= (bar.cx - bar.thickness/2 - ballRadius)) {
        // ball is beyond the right wall
        if (ball.y >= (bar.cy - bar.length/2 - ballRadius) && ball.y <= (bar.cy + bar.length/2 + ballRadius)) {
            // ball is colliding with right bar, flip the x component of its velocity
            ball.vx *= -1;
        }
        else {
            // ball is not colliding with the right bar, ball is dropped, reset playground
            stopGame();
        }
    }

    // top bar
    bar = barElements[2];
    if (ball.y <= (bar.cy + bar.thickness/2 + ballRadius)) {
        // ball is above the ceiling
        if (ball.x >= (bar.cx - bar.length/2 - ballRadius) && ball.x <= (bar.cx + bar.length/2 + ballRadius)) {
            // ball is colliding with top bar, flip the y component of its velocity
            ball.vy *= -1;
        }
        else {
            // ball is not colliding with the top bar, ball is dropped, reset playground
            stopGame();
        }
    }

    // left bar
    bar = barElements[3];
    if (ball.x <= (bar.cx + bar.thickness/2 + ballRadius)) {
        // ball is beyond the left wall
        if (ball.y >= (bar.cy - bar.length/2 - ballRadius) && ball.y <= (bar.cy + bar.length/2 + ballRadius)) {
            // ball is colliding with bottom bar, flip the y component of its velocity
            ball.vx *= -1;
        }
        else {
            // ball is not colliding with the left bar, ball is dropped, reset playground
            stopGame();
        }
    }
}