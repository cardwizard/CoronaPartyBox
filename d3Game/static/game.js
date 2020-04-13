"use strict";

// svg element parameters
var svgWidth = 800;
var svgHeight = 800;

var barLength = 100;
var barThickness = 10;

var ballRadius = 7;

// variables for svg objects
var svg;
var barGroup, renderedBars, ballGroup, renderedBall;
var barB, barR, barT, barL, ball;
var barElements, collisionElements, simulation;

// visual elements creation
svg = d3.select("#gameDiv").append("svg").attr("id", "gameSvg").attr("width", svgWidth).attr("height", svgHeight);

// initialize the game
initialize();

// set the render chain for the svg elements and render them once
render();

function initialize() {
    // json definitions of svg elements
    barB = {id: "barB", class: "pad", cx: svgWidth/2, cy: svgHeight-barThickness/2};
    barR = {id: "barR", class: "wall", cx: svgWidth - barThickness/2, cy: svgHeight/2};
    barT = {id: "barT", class: "wall", cx: svgWidth/2, cy: barThickness/2};
    barL = {id: "barL", class: "wall", cx: barThickness/2, cy: svgHeight/2};

    // assign random initial velocity to the ball
    ball = {id: "ball", class: "ball", x: svgWidth/2, y: svgHeight/2, r: ballRadius, vx: Math.random() * 5, vy: Math.random() * 5};

    // create a list of svg elements for adding to force field
    barElements = [barB, barR, barT, barL];
    collisionElements = barElements.concat([ball]);

    // Define the simulation field, set up the nodes and the forces in it
    simulation = d3.forceSimulation(collisionElements)
                    .force("collisionForce", reboundForce)
                    .on("tick", ticked)
                    .velocityDecay(0)   // no decay factor, let the simulation run till it is stopped explicitly
                    .stop();
}

function render() {
    // clear the old svg groups
    d3.select("#gameSvg").selectAll("g").remove();

    // set the render function chain for bars
    barGroup = d3.select("#gameSvg").append("g").attr("class", "bars").selectAll("rect").data(barElements);
    renderedBars = barGroup.enter()
                                .append("rect")
                                .attr("class", function (d) {return d.class})
                                .attr("id", function (d) {return d.id})
                                .attr("x", function (d) {
                                    if (d.id == "barB" || d.id == "barT") {
                                        return d.cx - barLength/2;
                                    }
                                    else {
                                        return d.cx - barThickness/2;
                                    }
                                })
                                .attr("y", function(d) {
                                    if (d.id == "barB" || d.id == "barT") {
                                        return d.cy - barThickness/2;
                                    }
                                    else {
                                        return d.cy - barLength/2;
                                    }
                                })
                                .attr("width", function (d) {
                                    if (d.id == "barB" || d.id == "barT") {
                                        return barLength;
                                    }
                                    else {
                                        return barThickness;
                                    }
                                })
                                .attr("height", function (d) {
                                    if (d.id == "barB" || d.id == "barT") {
                                        return barThickness;
                                    }
                                    else {
                                        return barLength;
                                    }
                                });

    // set the render function chain for ball
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
    console.log("start game");
    initialize();
    simulation.alpha(1).restart();
}

function stopGame() {
    console.log("stop game");
    simulation.stop();
}

function ticked() {
    // update ball position
    renderedBall.attr("cx", function(d) {return d.x;})
                .attr("cy", function(d) {return d.y;});

    // do not update the bar position here, it will be updated based on the user input
}

function reboundForce(alpha) {
    var bar;
    // check if the ball collides with any bar and rebound the ball if it does

    // bottom bar
    bar = barElements[0];
    if (ball.x >= (bar.cx - barLength/2 - ballRadius) &&
        ball.x <= (bar.cx + barLength/2 + ballRadius) &&
        ball.y >= (bar.cy - barThickness/2 - ballRadius)) 
    {
        // ball is colliding with bottom bar, flip the y component of its velocity
        ball.vy *= -1;
    }

    // right bar
    bar = barElements[1];
    if (ball.y >= (bar.cy - barLength/2 - ballRadius) &&
        ball.y <= (bar.cy + barLength/2 + ballRadius) &&
        ball.x >= (bar.cx - barThickness/2 - ballRadius)) 
    {
        // ball is colliding with bottom bar, flip the y component of its velocity
        ball.vx *= -1;
    }

    // top bar
    bar = barElements[2];
    if (ball.x >= (bar.cx - barLength/2 - ballRadius) &&
        ball.x <= (bar.cx + barLength/2 + ballRadius) &&
        ball.y <= (bar.cy + barThickness/2 + ballRadius)) 
    {
        // ball is colliding with bottom bar, flip the y component of its velocity
        ball.vy *= -1;
    }

    // left bar
    bar = barElements[3];
    if (ball.y >= (bar.cy - barLength/2 - ballRadius) &&
        ball.y <= (bar.cy + barLength/2 + ballRadius) &&
        ball.x <= (bar.cx + barThickness/2 + ballRadius)) 
    {
        // ball is colliding with bottom bar, flip the y component of its velocity
        ball.vx *= -1;
    }
}