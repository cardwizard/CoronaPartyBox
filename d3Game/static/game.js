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

var bar2ballSpeed = 0;

// visual elements creation
svg = d3.select("#gameDiv").append("svg").attr("id", "gameSvg").attr("width", svgWidth).attr("height", svgHeight);

// initialize the game
setup();

// render the svg elements once
render();

function setup() {
    // json definitions of svg elements
    barB = {id: "barB", class: "pad", x: svgWidth/2, y: svgHeight-barThickness/2, length: barLength, thickness: barThickness};
    // for multiplayer, convert all the below walls to bars
    barR = {id: "barR", class: "wall", x: svgWidth - wallThickness/2, y: svgHeight/2, length: wallLength, thickness: wallThickness};
    barT = {id: "barT", class: "pad", x: svgWidth/2, y: barThickness/2, length: barLength, thickness: barThickness};
    barL = {id: "barL", class: "wall", x: wallThickness/2, y: svgHeight/2, length: wallLength, thickness: wallThickness};

    // assign random initial velocity to the ball
    ball = {id: "ball", class: "ball", x: svgWidth/2, y: svgHeight/2, r: ballRadius, vx: (Math.random() - 0.5) * 20, vy: (Math.random() - 0.5) * 15};

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
    barB.x = svgWidth/2;
    barB.y = svgHeight-barB.thickness/2;

    // barR
    barR = barElements[1];
    barR.x = svgWidth - barR.thickness/2;
    barR.y = svgHeight/2;

    // barT
    barT = barElements[2];
    barT.x = svgWidth/2;
    barT.y = barT.thickness/2;

    // barL
    barL = barElements[3];
    barL.x = barL.thickness/2;
    barL.y = svgHeight/2;

    ball.x = svgWidth/2;
    ball.y = svgHeight/2;
    ball.vx = (Math.random() - 0.5) * 20;
    ball.vy = (Math.random() - 0.5) * 15;

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
                                    return d.x - d.length/2;
                                }
                                else {
                                    return d.x - d.thickness/2;
                                }
                            })
                            .attr("y", function(d) {
                                if (d.id == "barB" || d.id == "barT") {
                                    return d.y - d.thickness/2;
                                }
                                else {
                                    return d.y - d.length/2;
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
                        return d.x - d.length/2;
                    }
                    else {
                        return d.x - d.thickness/2;
                    }
                })
                .attr("y", function(d) {
                    if (d.id == "barB" || d.id == "barT") {
                        return d.y - d.thickness/2;
                    }
                    else {
                        return d.y - d.length/2;
                    }
                });

    bar2ballSpeed = 0;
}

function moveBar() {
    var userInput = d3.event.keyCode;
    var moveStep = 5;

    /*if (Date.now() - time < 50 && moveStep < 50) {
        moveStep += 2;
    }
    else {
        moveStep = 5;
    }
    time = Date.now();*/

    // use the user input to set the bottom bar position
    if ((userInput == 37) && (barElements[0].x - 2 > barElements[0].length/2)) {
        // left arrow
        barElements[0].x -= moveStep;
        bar2ballSpeed = -moveStep/5;
    }
    if ((userInput == 39) && (barElements[0].x + 2 < svgWidth - barElements[0].length/2)) {
        // right arrow
        barElements[0].x += moveStep;
        bar2ballSpeed = moveStep/5;
    }

    // use the user input to set the top bar position
    if ((userInput == 65) && (barElements[2].x - 2 > barElements[2].length/2)) {
        // left arrow
        barElements[2].x -= moveStep;
        bar2ballSpeed = -moveStep/5;
    }
    if ((userInput == 68) && (barElements[2].x + 2 < svgWidth - barElements[2].length/2)) {
        // right arrow
        barElements[2].x += moveStep;
        bar2ballSpeed = moveStep/5;
    }
}

function reboundForce(alpha) {
    var bar;
    // check if the ball collides with any bar and 
    // rebound the ball if it does
    // or end the game if it is dropped

    // bottom bar
    bar = barElements[0];
    if (ball.y >= (bar.y - bar.thickness/2 - ballRadius)) {
        // ball is below the ground
        if (ball.x >= (bar.x - bar.length/2 - ballRadius) && ball.x <= (bar.x + bar.length/2 + ballRadius)) {
            // ball is colliding with bottom bar, flip the y component of its velocity
            ball.vy *= -1;
            ball.vx += bar2ballSpeed;
        }
        else {
            // ball is not colliding with the bottom bar, ball is dropped, reset playground
            stopGame();
        }
    }

    // right bar
    bar = barElements[1];
    if (ball.x >= (bar.x - bar.thickness/2 - ballRadius)) {
        // ball is beyond the right wall
        if (ball.y >= (bar.y - bar.length/2 - ballRadius) && ball.y <= (bar.y + bar.length/2 + ballRadius)) {
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
    if (ball.y <= (bar.y + bar.thickness/2 + ballRadius)) {
        // ball is above the ceiling
        if (ball.x >= (bar.x - bar.length/2 - ballRadius) && ball.x <= (bar.x + bar.length/2 + ballRadius)) {
            // ball is colliding with top bar, flip the y component of its velocity
            ball.vy *= -1;
            ball.vx += bar2ballSpeed;
        }
        else {
            // ball is not colliding with the top bar, ball is dropped, reset playground
            stopGame();
        }
    }

    // left bar
    bar = barElements[3];
    if (ball.x <= (bar.x + bar.thickness/2 + ballRadius)) {
        // ball is beyond the left wall
        if (ball.y >= (bar.y - bar.length/2 - ballRadius) && ball.y <= (bar.y + bar.length/2 + ballRadius)) {
            // ball is colliding with bottom bar, flip the y component of its velocity
            ball.vx *= -1;
        }
        else {
            // ball is not colliding with the left bar, ball is dropped, reset playground
            stopGame();
        }
    }
}